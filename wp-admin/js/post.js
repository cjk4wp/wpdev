function array_unique_noempty(b){var c=[];jQuery.each(b,function(a,d){d=jQuery.trim(d);if(d&&jQuery.inArray(d,c)==-1){c.push(d)}});return c}function new_tag_remove_tag(){var e=jQuery(this).attr("id"),a=e.split("-check-num-")[1],c=jQuery(this).parents(".tagsdiv"),b=c.find(".the-tags").val().split(","),d=[];delete b[a];jQuery.each(b,function(f,g){g=jQuery.trim(g);if(g){d.push(g)}});c.find(".the-tags").val(d.join(",").replace(/\s*,+\s*/,",").replace(/,+/,",").replace(/,+\s+,+/,",").replace(/,+\s*$/,"").replace(/^\s*,+/,""));tag_update_quickclicks(c);return false}function tag_update_quickclicks(b){if(jQuery(b).find(".the-tags").length==0){return}var a=jQuery(b).find(".the-tags").val().split(",");jQuery(b).find(".tagchecklist").empty();shown=false;jQuery.each(a,function(e,f){var c,d;f=jQuery.trim(f);if(!f.match(/^\s+$/)&&""!=f){d=jQuery(b).attr("id")+"-check-num-"+e;c='<span><a id="'+d+'" class="ntdelbutton">X</a>&nbsp;'+f+"</span> ";jQuery(b).find(".tagchecklist").append(c);jQuery("#"+d).click(new_tag_remove_tag)}});if(shown){jQuery(b).find(".tagchecklist").prepend("<strong>"+postL10n.tagsUsed+"</strong><br />")}}function tag_flush_to_text(g,b){b=b||false;var e,f,c,d;e=jQuery("#"+g);f=b?jQuery(b).text():e.find("input.newtag").val();if(e.find("input.newtag").hasClass("form-input-tip")&&!b){return false}c=e.find(".the-tags").val();d=c?c+","+f:f;d=d.replace(/\s+,+\s*/g,",").replace(/,+/g,",").replace(/,+\s+,+/g,",").replace(/,+\s*$/g,"").replace(/^\s*,+/g,"");d=array_unique_noempty(d.split(",")).join(",");e.find(".the-tags").val(d);tag_update_quickclicks(e);if(!b){e.find("input.newtag").val("").focus()}return false}function tag_save_on_publish(){jQuery(".tagsdiv").each(function(a){if(!jQuery(this).find("input.newtag").hasClass("form-input-tip")){tag_flush_to_text(jQuery(this).parents(".tagsdiv").attr("id"))}})}function tag_press_key(a){if(13==a.which){tag_flush_to_text(jQuery(a.target).parents(".tagsdiv").attr("id"));return false}}function tag_init(){jQuery(".ajaxtag").show();jQuery(".tagsdiv").each(function(a){tag_update_quickclicks(this)});jQuery(".ajaxtag input.tagadd").click(function(){tag_flush_to_text(jQuery(this).parents(".tagsdiv").attr("id"))});jQuery(".ajaxtag input.newtag").focus(function(){if(!this.cleared){this.cleared=true;jQuery(this).val("").removeClass("form-input-tip")}});jQuery(".ajaxtag input.newtag").blur(function(){if(this.value==""){this.cleared=false;jQuery(this).val(postL10n.addTag).addClass("form-input-tip")}});jQuery("#publish").click(tag_save_on_publish);jQuery("#save-post").click(tag_save_on_publish);jQuery(".ajaxtag input.newtag").keypress(tag_press_key)}var commentsBox,tagCloud;(function(a){commentsBox={st:0,get:function(d,c){var b=this.st,e;if(!c){c=20}this.st+=c;this.total=d;a("#commentsdiv img.waiting").show();e={action:"get-comments",mode:"single",_ajax_nonce:a("#add_comment_nonce").val(),post_ID:a("#post_ID").val(),start:b,num:c};a.post(ajaxurl,e,function(f){f=wpAjax.parseAjaxResponse(f);a("#commentsdiv .widefat").show();a("#commentsdiv img.waiting").hide();if("object"==typeof f&&f.responses[0]){a("#the-comment-list").append(f.responses[0].data);theList=theExtraList=null;a("a[className*=':']").unbind();setCommentsList();if(commentsBox.st>commentsBox.total){a("#show-comments").hide()}else{a("#show-comments").html(postL10n.showcomm)}return}else{if(1==f){a("#show-comments").parent().html(postL10n.endcomm);return}}a("#the-comment-list").append('<tr><td colspan="5">'+wpAjax.broken+"</td></tr>")});return false}};tagCloud={init:function(){a(".tagcloud-link").click(function(){tagCloud.get(a(this).attr("id"));a(this).unbind().click(function(){a(this).siblings(".the-tagcloud").toggle();return false});return false})},get:function(c){var b=c.substr(c.indexOf("-")+1);a.post(ajaxurl,{action:"get-tagcloud",tax:b},function(e,d){if(0==e||"success"!=d){e=wpAjax.broken}e=a('<p id="tagcloud-'+b+'" class="the-tagcloud">'+e+"</p>");a("a",e).click(function(){var f=a(this).parents("p").attr("id");tag_flush_to_text(f.substr(f.indexOf("-")+1),this);return false});a("#"+c).after(e)})}};a(document).ready(function(){tagCloud.init()})})(jQuery);jQuery(document).ready(function(h){var n,j,e=false,k=false,d=false,m,f,i=true,a=h("#timestamp").html(),b=h("#post-visibility-display").html(),l="";if(typeof autosave!="function"){autosave=function(){}}postboxes.add_postbox_toggles("post");make_slugedit_clickable();tag_init();h("#title").blur(function(){if((h("#post_ID").val()>0)||(h("#title").val().length==0)){return}autosave()});h(".newtag").each(function(){var o=h(this).parents("div.tagsdiv").attr("id");h(this).suggest("admin-ajax.php?action=ajax-tag-search&tax="+o,{delay:500,minchars:2,multiple:true,multipleSep:", "})});n=jQuery("#category-tabs").tabs();j=h("#newcat").one("focus",function(){h(this).val("").removeClass("form-input-tip")});h("#category-add-sumbit").click(function(){j.focus()});m=function(){if(d){return}d=true;var o=jQuery(this),q=o.is(":checked"),p=o.val().toString();h("#in-category-"+p+", #in-popular-category-"+p).attr("checked",q);d=false};popularCats=h("#categorychecklist-pop :checkbox").map(function(){return parseInt(jQuery(this).val(),10)}).get().join(",");catAddBefore=function(o){o.data+="&popular_ids="+popularCats+"&"+jQuery("#categorychecklist :checked").serialize();return o};f=function(p,o){if(!e){e=jQuery("#newcat_parent")}if(!k){k=e.find("option[value=-1]")}h(o.what+" response_data",p).each(function(){var q=h(h(this).text());q.find("label").each(function(){var s=h(this),u=s.find("input").val(),v=s.find("input")[0].id,r,t;h("#"+v).change(m).change();if(e.find("option[value="+u+"]").size()){return}r=h.trim(s.text());t=h('<option value="'+parseInt(u,10)+'"></option>').text(r);e.prepend(t)});k.attr("selected",true)})};h("#categorychecklist").wpList({alt:"",response:"category-ajax-response",addBefore:catAddBefore,addAfter:f});h("#category-add-toggle").click(function(){h(this).parents("div:first").toggleClass("wp-hidden-children");n.find('a[href="#categories-all"]').click();h("#newcat").focus();return false});h('a[href="#categories-all"]').click(function(){deleteUserSetting("cats")});h('a[href="#categories-pop"]').click(function(){setUserSetting("cats","pop")});if("pop"==getUserSetting("cats")){h('a[href="#categories-pop"]').click()}h(".categorychecklist .popular-category :checkbox").change(m).filter(":checked").change(),l="";function g(){if(h("#post-visibility-select input:radio:checked").val()!="public"){h("#sticky").attr("checked",false);h("#sticky-span").hide()}else{h("#sticky-span").show()}if(h("#post-visibility-select input:radio:checked").val()!="password"){h("#password-span").hide()}else{h("#password-span").show()}}function c(){var o,q,p,r;o=new Date(h("#aa").val(),h("#mm").val()-1,h("#jj").val(),h("#hh").val(),h("#mn").val());q=new Date(h("#hidden_aa").val(),h("#hidden_mm").val()-1,h("#hidden_jj").val(),h("#hidden_hh").val(),h("#hidden_mn").val());p=new Date(h("#cur_aa").val(),h("#cur_mm").val()-1,h("#cur_jj").val(),h("#cur_hh").val(),h("#cur_mn").val());if(o>p&&h("#original_post_status").val()!="future"){r=postL10n.publishOnFuture;h("#publish").val(postL10n.schedule)}else{if(o<=p&&h("#original_post_status").val()!="publish"){r=postL10n.publishOn;h("#publish").val(postL10n.publish)}else{r=postL10n.publishOnPast;h("#publish").val(postL10n.update)}}if(q.toUTCString()==o.toUTCString()){h("#timestamp").html(a)}else{h("#timestamp").html(r+" <b>"+h("#mm option[value="+h("#mm").val()+"]").text()+" "+h("#jj").val()+", "+h("#aa").val()+" @ "+h("#hh").val()+":"+h("#mn").val()+"</b> ")}if(h("#post-visibility-select input:radio:checked").val()=="private"){h("#publish").val(postL10n.update);if(h("#post_status option[value=publish]").length==0){h("#post_status").append('<option value="publish">'+postL10n.privatelyPublished+"</option>")}h("#post_status option[value=publish]").html(postL10n.privatelyPublished);h("#post_status option[value=publish]").attr("selected",true);h(".edit-post-status").hide()}else{if(h("#original_post_status").val()=="future"||h("#original_post_status").val()=="draft"){if(h("#post_status option[value=publish]").length!=0){h("#post_status option[value=publish]").remove();h("#post_status").val(h("#hidden_post_status").val())}}else{h("#post_status option[value=publish]").html(postL10n.published)}h(".edit-post-status").show()}h("#post-status-display").html(h("#post_status :selected").text());if(h("#post_status :selected").val()=="private"||h("#post_status :selected").val()=="publish"){h("#save-post").hide()}else{h("#save-post").show();if(h("#post_status :selected").val()=="pending"){h("#save-post").show().val(postL10n.savePending)}else{h("#save-post").show().val(postL10n.saveDraft)}}}h(".edit-visibility").click(function(){if(h("#post-visibility-select").is(":hidden")){g();h("#post-visibility-select").slideDown("normal");h(".edit-visibility").hide()}return false});h(".cancel-post-visibility").click(function(){h("#post-visibility-select").slideUp("normal");h("#visibility-radio-"+h("#hidden-post-visibility").val()).attr("checked",true);h("#post_password").val(h("#hidden_post_password").val());h("#sticky").attr("checked",h("#hidden-post-sticky").attr("checked"));h("#post-visibility-display").html(b);h(".edit-visibility").show();c();return false});h(".save-post-visibility").click(function(){h("#post-visibility-select").slideUp("normal");h(".edit-visibility").show();c();if(h("#post-visibility-select input:radio:checked").val()!="public"){h("#sticky").attr("checked",false)}if(true==h("#sticky").attr("checked")){l="Sticky"}else{l=""}h("#post-visibility-display").html(postL10n[h("#post-visibility-select input:radio:checked").val()+l]);return false});h("#post-visibility-select input:radio").change(function(){g()});h(".edit-timestamp").click(function(){if(h("#timestampdiv").is(":hidden")){h("#timestampdiv").slideDown("normal");h(".edit-timestamp").hide()}return false});h(".cancel-timestamp").click(function(){h("#timestampdiv").slideUp("normal");h("#mm").val(h("#hidden_mm").val());h("#jj").val(h("#hidden_jj").val());h("#aa").val(h("#hidden_aa").val());h("#hh").val(h("#hidden_hh").val());h("#mn").val(h("#hidden_mn").val());h(".edit-timestamp").show();c();return false});h(".save-timestamp").click(function(){h("#timestampdiv").slideUp("normal");h(".edit-timestamp").show();c();return false});h(".edit-post-status").click(function(){if(h("#post-status-select").is(":hidden")){h("#post-status-select").slideDown("normal");h(this).hide()}return false});h(".save-post-status").click(function(){h("#post-status-select").slideUp("normal");h(".edit-post-status").show();c();return false});h(".cancel-post-status").click(function(){h("#post-status-select").slideUp("normal");h("#post_status").val(h("#hidden_post_status").val());h(".edit-post-status").show();c();return false});jQuery("#the-list").wpList({addAfter:function(o,p){h("table#list-table").show();if(jQuery.isFunction(autosave_update_post_ID)){autosave_update_post_ID(p.parsed.responses[0].supplemental.postid)}},addBefore:function(o){o.data+="&post_id="+jQuery("#post_ID").val();return o}});h("#post-preview").click(function(o){if(1>h("#post_ID").val()&&autosaveFirst){autosaveDelayPreview=true;autosave();return false}h("input#wp-preview").val("dopreview");h("form#post").attr("target","wp-preview").submit().attr("target","");h("input#wp-preview").val("");return false});if(typeof tinyMCE!="undefined"){h("#title")[h.browser.opera?"keypress":"keydown"](function(o){if(o.which==9&&!o.shiftKey&&!o.controlKey&&!o.altKey){if((h("#post_ID").val()<1)&&(h("#title").val().length>0)){autosave()}if(tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()&&i){o.preventDefault();i=false;tinyMCE.activeEditor.focus();return false}}})}});