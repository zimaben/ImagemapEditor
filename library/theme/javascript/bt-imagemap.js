// variables passed from PHP ## 
var debug = (bt_imagemap.debug == 1 ? true : false);
var map_width = bt_imagemap.imagesize.width;
var map_height = bt_imagemap.imagesize.height;
var real_height = 0;
var resizeTimer;
// variable passed from template: bt_imagemap_postid 

if ( typeof jQuery !== 'undefined' ) {
    jQuery(document).ready(function() {
     if( typeof bt_imagemap_postid !=='undefined' && Array.isArray(bt_imagemap_postid) ) { 
        bt_bind_array = [];
         for(z=0;z<bt_imagemap_postid.length;z++) {
            imageid = '#bt_imagemap' + bt_imagemap_postid[z];
            console.log('synching '+imageid );
            syncmap(imageid);
            bt_bind_array.push( imageid );   
         }
         jQuery(window).on('resize', function(){ mapster_resize_array(bt_bind_array) } ); 

     } else if( typeof bt_imagemap_postid !=='undefined' ){
        imageid = '#bt_imagemap' + bt_imagemap_postid;
        syncmap(imageid);
        jQuery(window).on('resize', function(){ mapster_resize(imageid) } );
     } 
       
    jQuery('img').mapster({
                mapKey: 'name',
                fill: false,
                fillOpacity: 0.4,
                fillColor: "ffffff",
                stroke: false,
                strokeColor: "00FF66",
                strokeOpacity: 1,
                strokeWidth: 2,
                singleSelect: true,
                listKey: 'name',
                scaleMap: false, //Keep this set to false, the syncmap function will do it - we need the width the image was edited on for initial sync
                onClick: function() {
                    window.location=this.href;
                    return false;
                }
            });
        jQuery('.styled-input-single>input').change(function() {
            $key = jQuery(this).data('key');
            jQuery('.desc').hide();
            if( jQuery(this).prop('checked') == true ) {
                jQuery('input:checkbox').each(function(){
                    if( jQuery(this).data('key') !== $key ){ jQuery(this).prop('checked', false); }
                });
                jQuery('#project').mapster('set',true,$key,);
                jQuery($description).fadeIn().css("display", "block");
                } else { jQuery('#project').mapster('set',false,$key,); }
        });
        jQuery('.close').click(function(){
            jQuery(this).parent().removeClass('active');
            jQuery('area').mapster('deselect');
        });
    });
}
function syncmap(sel){
    let img = jQuery(sel);
    if(img.length){
        let map = img.attr('usemap').replace('#','');
        let img_width = img.parent().width();
        if(real_height = 0 ) { real_height = img.parent().height(); }
    
        //doing this the old fashioned way
        let map_obj = document.getElementById(map);
        let areas = map_obj.getElementsByTagName('area');
        var multiplier =  img_width / bt_imagemap.imagesize.width;
        let markup = '';
        for(i=0;i<areas.length;i++){
            let this_area = areas[i].outerHTML;
            let left = this_area.indexOf('coords="') + 8;
            let right = this_area.indexOf('"', left);
            let right_text = this_area.substring(0, left);
            let old_coords = this_area.substring(left, right);
            let old_coords_a = old_coords.split(',')
            let new_coords = [];
            for(idx=0;idx<old_coords_a.length;idx++){
                let coord = parseInt(old_coords_a[idx]);
                let new_coord = Math.round(coord * multiplier);
                new_coords.push(new_coord);
            }
            new_coords = new_coords.join();
            this_area.replace(old_coords, new_coords);
            markup += right_text + new_coords + '">';
            }
        jQuery(map_obj).html(markup);
    }
}
function mapster_resize(sel){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){

        let img = jQuery(sel);
        let width = img.width();
        if(!width >0 ) {width = img.prev().width(); }
        let height = img.height();
        if(! height >0 ) { height = img.prev().height(); }
        let y_ratio = height / width;
        let img_width = img.parent().parent().width();
        let img_height = Math.round(img_width * y_ratio);
        jQuery(sel).mapster('resize', img_width, img_height, 100);
        
    }, 250 );

}
function mapster_resize_array(sel){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
        for(c=0;c<sel.length;c++){
            let img = jQuery(sel[c]);
            let width = img.width();
            if(!width >0 ) {width = img.prev().width(); }
            let height = img.height();
            if(! height >0 ) { height = img.prev().height(); }
            let y_ratio = height / width;
            let img_width = img.parent().parent().width();
            let img_height = Math.round(img_width * y_ratio);
            jQuery(sel[c]).mapster('resize', img_width, img_height, 100);
            
        }
    }, 250 );

}
