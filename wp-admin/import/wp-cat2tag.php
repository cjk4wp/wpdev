<?php

class WP_Categories_to_Tags {
	var $categories_to_convert = array();
	var $all_categories = array();
	
	function header() {
		print '<div class="wrap">';
		print '<h2>' . __('Convert Categories to Tags') . '</h2>';
	}
	
	function footer() {
		print '</div>';
	}
	
	function populate_all_categories() {
		global $wpdb;
		
		$this->all_categories = $wpdb->get_results("SELECT * FROM $wpdb->categories WHERE (type & ~ " . TAXONOMY_TAG . ") != 0 AND category_count > 0 ORDER BY cat_name ASC");
	}
	
	function welcome() {
		$this->populate_all_categories();
		
		print '<div class="narrow">';
		
		if (count($this->all_categories) > 0) {
			print '<p>' . __('Howdy! This converter allows you to selectively convert existing categories to tags. To get started, check the checkboxes of the categories you wish to be converted, then click the Convert button.') . '</p>';
			print '<p>' . __('Keep in mind that if you convert a category with child categories, those child categories get their parent setting removed, so they\'re in the root.') . '</p>';
		
			$this->categories_form();
		} else {
			print '<p>'.__('You have no categories to convert!').'</p>';
		}
		
		print '</div>';
	}
	
	function categories_form() {
		print '<form action="admin.php?import=wp-cat2tag&amp;step=2" method="post">';
		print '<ul style="list-style:none">';
		
		$hier = _get_category_hierarchy();
		
		foreach ($this->all_categories as $category) {
			if ((int) $category->category_parent == 0) {
				print '<li><label><input type="checkbox" name="cats_to_convert[]" value="' . intval($category->cat_ID) . '" /> ' . $category->cat_name . ' (' . $category->category_count . ')</label>';
				
				if (isset($hier[$category->cat_ID])) {
					$this->_category_children($category, $hier);
				}
				
				print '</li>';
			}
		}
		
		print '</ul>';
		
		print '<p class="submit"><input type="submit" name="maybe_convert_all_cats" value="' . __('Convert All Categories') . '" /> <input type="submit" name="submit" value="' . __('Convert &raquo;') . '" /></p>';
		print '</form>';
	}
	
	function _category_children($parent, $hier) {
		print '<ul style="list-style:none">';
		
		foreach ($hier[$parent->cat_ID] as $child_id) {
			$child =& get_category($child_id);
			
			print '<li><label><input type="checkbox" name="cats_to_convert[]" value="' . intval($child->cat_ID) . '" /> ' . $child->cat_name . ' (' . $child->category_count . ')</label>';
			
			if (isset($hier[$child->cat_ID])) {
				$this->_category_children($child, $hier);
			}
			
			print '</li>';
		}
		
		print '</ul>';
	}
	
	function _category_exists($cat_id) {
		global $wpdb;
		
		$cat_id = (int) $cat_id;
		
		$maybe_exists = $wpdb->get_results("SELECT cat_ID from $wpdb->categories WHERE cat_ID = '$cat_id'");
		
		if (count($maybe_exists) > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	function convert_them() {
		global $wpdb;
		
		if (!isset($_POST['cats_to_convert']) || !is_array($_POST['cats_to_convert'])) {
			print '<div class="narrow">';
			print '<p>' . sprintf(__('Uh, oh. Something didn\'t work. Please <a href="%s">try again</a>.'), 'admin.php?import=wp-cat2tag') . '</p>';
			print '</div>';
		}
		
		$this->categories_to_convert = $_POST['cats_to_convert'];
		$hier = _get_category_hierarchy();
		
		print '<ul>';
		
		foreach ($this->categories_to_convert as $cat_id) {
			$cat_id = (int) $cat_id;
			
			print '<li>' . __('Converting category') . ' #' . $cat_id . '... ';
			
			if (!$this->_category_exists($cat_id)) {
				_e('Category doesn\'t exist!');
			} else {
				$category =& get_category($cat_id);
				
				if ($category->link_count > 0) {
					$type = $category->type | TAXONOMY_TAG;
				} else {
					$type = TAXONOMY_TAG;
				}
				
				// Set the category itself to $type from above
				$wpdb->query("UPDATE $wpdb->categories SET type = '$type' WHERE cat_ID = '{$category->cat_ID}'");
				
				// Set relationships in post2cat to 'tag', category_count becomes tag_count
				$wpdb->query("UPDATE $wpdb->post2cat SET rel_type = 'tag' WHERE category_ID = '{$category->cat_ID}'");
				$wpdb->query("UPDATE $wpdb->categories SET tag_count = '{$category->category_count}', category_count = '0' WHERE cat_ID = '{$category->cat_ID}'");
				
				// Set all parents to 0 (root-level) if their parent was the converted tag
				$wpdb->query("UPDATE $wpdb->categories SET category_parent = 0 WHERE category_parent = '{$category->cat_ID}'");
				
				// Clean the cache
				clean_category_cache($category->cat_ID);
				
				_e('Converted successfully.');
			}
			
			print '</li>';
		}
		
		print '</ul>';
	}
	
	function convert_all_confirm() {
		print '<div class="narrow">';
		
		print '<h3>' . __('Confirm') . '</h3>';
		
		print '<p>' . __('You are about to convert all categories to tags. Are you sure you want to continue?') . '</p>';
		
		print '<form action="admin.php?import=wp-cat2tag" method="post">';
		print '<p style="text-align:center" class="submit"><input type="submit" value="' . __('Yes') . '" name="yes_convert_all_cats" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" value="' . __('No') . '" name="no_dont_do_it" /></p>';
		print '</form>';
		
		print '</div>';
	}
	
	function convert_all() {
		global $wpdb;
		
		$cats = $wpdb->get_results("SELECT * FROM $wpdb->categories WHERE (type & ~ " . TAXONOMY_TAG . ") != 0 AND category_count > 0");
		
		$_POST['cats_to_convert'] = array();
		
		foreach ($cats as $cat) {
			$_POST['cats_to_convert'][] = $cat->cat_ID;
		}
		
		$this->convert_them();
	}
	
	function init() {
		echo '<!--'; print_r($_POST); print_r($_GET); echo '-->';
		
		if (isset($_POST['maybe_convert_all_cats'])) {
			$step = 3;
		} elseif (isset($_POST['yes_convert_all_cats'])) {
			$step = 4;
		} elseif (isset($_POST['no_dont_do_it'])) {
			die('no_dont_do_it');
		} else {
			$step = (isset($_GET['step'])) ? (int) $_GET['step'] : 1;
		}
		
		$this->header();
		
		if (!current_user_can('manage_categories')) {
			print '<div class="narrow">';
			print '<p>' . __('Cheatin&#8217; uh?') . '</p>';
			print '</div>';
		} else {
			switch ($step) {
				case 1 :
					$this->welcome();
				break;
				
				case 2 :
					$this->convert_them();
				break;
				
				case 3 :
					$this->convert_all_confirm();
				break;
				
				case 4 :
					$this->convert_all();
				break;
			}
		}
		
		$this->footer();
	}
	
	function WP_Categories_to_Tags() {
		// Do nothing.
	}
}

$wp_cat2tag_importer = new WP_Categories_to_Tags();

register_importer('wp-cat2tag', __('Categories to Tags Converter'), __('Convert existing categories to tags, selectively.'), array(&$wp_cat2tag_importer, 'init'));

?>
