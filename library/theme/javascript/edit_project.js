if(typeof jQuery !== 'undefined'){
    jQuery(document).ready(function(){
        if(jQuery('.tgm-edit-project').length ) {
            jQuery('.tgm-edit-project').click(function(){
                //HERE ARE MY LOCALIZED VARIABLES
                console.log(edit_project.postid);
                console.log(edit_project.img);
                console.log(edit_project.list);
                console.log(debug);
                console.log(edit_project.custom_image_size.width);
                console.log(edit_project.custom_image_size.height);

                $args = extract_arguments(edit_project.img, edit_project.list);

                imagemap_editor_edit(
                    edit_project.custom_image_size.width,
                    edit_project.custom_image_size.height, 
                    edit_project.img, 
                    edit_project.list,
                    '#mapEditor');


            });
        
        }
    });
    function imagemap_editor_edit($w, $h, $url, $list, $mapEditor){
        var wrap = document.createElement("div");
            wrap.id = "imagemap4posis";
        var args = extract_arguments($url, $list);
        //elements 
        var container = document.createElement("div");
            container.id = "mapContainer";
            jQuery(container).addClass("effect");
            jQuery(container).attr("style","width: "+$w+"px; height: "+$h+"px;");
        var img = document.createElement("img");
            img.src = args.img;
            img.id = "main";
            jQuery(img).addClass("imgmapMainImage");
            jQuery(img).attr("style","width: "+$w+"px;");
            jQuery(img).attr("usemap", "#map");

        var map = document.createElement("map");
            map.id = "map";
            jQuery(map).attr('name', 'map');
        var form = document.createElement("div");
            form.id = "coords_area";	
            form.innerHTML = '</ul><div class="view_controls"><span id="view_copy"><i class="far fa-copy"></i> Copy to clipboard</span><span class="status"></span> <span id="view_close"><i class="far fa-times-circle"></i></span></div><input id="coordsText" class="effect" name="" type="text" value="" placeholder="« Coordinates »"><textarea name="" id="areaText" class="effect" placeholder="« HTML-Code »" style="width: 500px;"></textarea>';
    
        var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = get_js_url()+"imagemap-editor.js";//This is not the recommended way to source scripts - @TODO revisit this code

        var st = document.createElement("link");
            st.rel = "stylesheet";
            st.type = 'text/css';
            st.href = get_css_url()+"imagemap-editor.css";

        var dots = document.createElement("div");
            dots.id = "dots";
        var list = args.list;
        jQuery(container).append(
            img,
            map,
            dots
        );
        build_edit_controls(wrap, container, list);
        jQuery(wrap).append(
            s, //Script first, then style
            st,
            container,
            form
        );
        jQuery(wrap).attr("style","width: "+parseInt($w+120)+"px; height: "+parseInt($h+40)+"px;");//50px padding plus 70px for the side control panel
       //if( tgm_nmp_media.debug == 1 ) console.log( wrap );

        //re-add event listeners for the edit buttons
        jQuery( wrap ).find('.layer_delete').click(function(e){ layer_delete(e); });
        jQuery( wrap ).find('.layer_edit').click(function(e){ layer_edit(e); });
        jQuery('#view_all').click(function(){ map_preview(); });
        // done with event listeners
        if(typeof jQuery.featherlight === 'function' ){
        jQuery.featherlight(jQuery(wrap), {
            type:{jquery: true},
            beforeClose: function(){
                var leaving = true;
                    if(!done_editing && jQuery('#groups_list').children('li').length ){
                    leaving = confirm('You currently have unsaved map areas. If you leave the editor now all changes will be lost. Do you want to exit?')
                    }
                if(!leaving) return false;   
                }
            });
        } else {console.log('featherlight dependency missing')}
        //jQuery('#mapEditor').addClass('active').append(wrap); 

    }

    function extract_arguments( $map, $ul ){

        let the_map = document.createElement('div');
        the_map.innerHTML = $map;
        let img = the_map.getElementsByTagName('img')[0].src;
        console.log('img: '+ img);
        $map = the_map.getElementsByTagName('map')[0]//convert map to HTMLObject 
        let the_list_wrap = document.createElement('div');
        the_list_wrap.innerHTML = $ul;
        let the_list = the_list_wrap.getElementsByTagName('ul')[0];//convert ul to HTMLObject 
        var the_id = the_list.id.replace('set_list', '').trim();
        let keys = [];
        let this_areas = [];
        let list_items = the_list.getElementsByTagName('li');
        var return_list = '<ul class="groups" id="groups_list">';
        for(x=0;x<list_items.length;x++){
            keys.push(list_items[x].innerHTML.trim() );
        }
        var areas = $map.getElementsByTagName('area');

        for(x=0;x<keys.length;x++){
            let key = keys[x];

            this_areas.push( [key , ''] );
            for(y=0;y<areas.length;y++) {
                if(areas[y].title == key){
                    var existing_string = this_areas[x][1] += areas[y].outerHTML;
                    //let this_area = scrubID(the_id, areas[y]); ID is not in the areas markup
                    this_areas[x][1].innerHTML = existing_string;
                }
            };
        }//now we have everything to build the list

        for(x=0;x<this_areas.length;x++){
            let title = this_areas[x][0];
            let key = title.replace(/ /g,"_").toLowerCase();
            let all_areas = this_areas[x][1];

            return_list += '<li class="area" id="'+key+'"> <span class="layer_delete"><i class="far fa-times-circle"></i> </span><span class="layer_edit"><i class="far fa-edit"></i> </span><span class="layer_title">'+title+'</span><span class="hidden_code">'+all_areas+'</span></li>';
        }
        return_list +='</ul>';
        console.log(img);
        console.log(return_list);
        return {
            'img' : img,
            'list' : return_list
        }
    }

        
    function scrubID(id, st){
        var idregex = new RegExp(id, "g");
        st = st.replace(idregex, '');
        return st;
    }

    function build_edit_controls(parent_element, img_contain, list){
        var top_contain = document.createElement('div');
            top_contain.id = "main_txt";
            jQuery(top_contain).addClass("main_txt");
            top_contain.innerHTML = "<h2 id='main_title'>Start Mapping</h2><label class='top_label' for='main_name'>Add a new Set Piece to the Project:</label><input type='text' name='main_name' class='main_name inactive' value='' placeholder='Set Piece Name...' /><span class='nonextstep'><i class='fas fa-times'></i></span><label class='top_label' for='main_url'>Set Piece Page URL:</label><input type='text' name='main_url' class='main_url inactive' value='' placeholder='https://yoursite.com/page/' />";
        var top_controls = document.createElement('div');
            top_controls.id = "top_controls";
            jQuery(top_controls).addClass("top_controls");
        var side_controls = document.createElement('div');
            side_controls.id = "side_controls";
            jQuery(side_controls).addClass("side_controls");
        if(is_font_awesome){     
            top_controls.innerHTML = '<ul id="top_control_pills"><li class="add"><span class="top_button"><i class="far fa-plus-square"></i>Add Set Piece</span></li><li class="done"><span class="top_button" id="all_done"><i class="far fa-check-square"></i>All Finished</span></li></ul><div id="action_center"></div>';
            side_controls.innerHTML = '<ul id="side_control_buttons" class="inactive"><li class="add" title="Add New Area"><span class="side_button" id="new_area"><i class="far fa-plus-square"></i>new area</span></li><li class="clear" title="Clear Last Area"><span class="side_button" id="clear_area"><i class="far fa-minus-square"></i>clear last</span></li><li class="trash" title="Clear This Set Piece"><span class="side_button" id="clear_all"><i class="far fa-trash-alt"></i>clear all</span></li><li class="check" title="Finished Area"><span class="side_button" id="area_done"><i class="far fa-check-square"></i>done</span></li><li class="code" title="View the HTML Code"><span class="side_button" id="view_code"><i class="fas fa-code"></i>view HTML</span></li><li class="view" title="View All Map Areas"><span class="side_button" id="view_all"><i class="fas fa-eye"></i>View All Areas</span></li></ul><div class="area_groups"><span class="area_groups_title">Set Pieces</span>' + list + '<div id="edit_center"><label for="edit_name">Edit Current Name:</label><input type="text" name="edit_name" id="edit_name"><label for="edit_url">New URL</label><input type="text" name="edit_url" id="edit_url"><button class="edit_button inactive" id="edit_save_changes" disabled>Save Changes</button><button class="edit_button inactive" id="remap" disabled>Edit Map Areas</button><span id="close_edit_center"><i class="far fa-times-circle"></i></span></div>';
            } else {
                top_controls.innerHTML = '<ul id="top_control_pills"><li class="add"><span class="top_button">Add New Area</span></li><li class="done"><span class="top_button" id="all_done">Done Editing</span></li></ul><div id="action_center"></div>';
                side_controls.innerHTML = '<ul id="side_control_buttons" class="inactive"><li class="add" title="Add New Area"><span class="side_button">new area</span></li><li class="clear" title="Clear Last Area"><span class="side_button">clear last</span></li><li class="trash" title="Clear This Set Piece"><span class="side_button">clear all</span></li><li class="code" title="View the HTML Code"><span class="side_button">view HTML</span></li><li class="view" title="View All Map Areas"><span class="side_button" id="view_all">View All Areas</span></li></ul><div class="area_groups"><span class="area_groups_title">Set Pieces</span>' + list + '<div id="edit_center"><label for="edit_name">Edit Current Name:</label><input type="text" name="edit_name" id="edit_name"><label for="edit_url">New URL</label><input type="text" name="edit_url" id="edit_url"><button class="edit_button inactive" id="edit_save_changes" disabled>Save Changes</button><button class="edit_button inactive" id="remap" disabled>Edit Map Areas</button><span id="close_edit_center">X</span></div>';
            }

        jQuery(top_contain).append(top_controls);
        jQuery(img_contain).addClass('inactive');
        jQuery(parent_element).append(top_contain, img_contain, side_controls);

    }
}