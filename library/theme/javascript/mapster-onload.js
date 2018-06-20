<script>
    if(typeof(jQuery) !== 'undefined' ){
   jQuery(document).ready(function () {
     
     
   jQuery('#project').mapster({
            mapKey: 'alt',
            fillOpacity: 0.4,
            fillColor: "ffffff",
            stroke: true,
            strokeColor: "00FF66",
            strokeOpacity: 1,
            strokeWidth: 2,
            singleSelect: true,
            listKey: 'name',
            onClick: function (e) {
                    jQuery('input:checkbox').each(function(){
                        if( jQuery(this).data('key') !== e.key ){ jQuery(this).prop('checked', false); }
                        });
                    $product = jQuery("#product-list").find("[data-key='"+e.key+"']");
                    if( $product.length ){ 
                        $product.prop("checked", true);
                        jQuery("#product-list").addClass("active");
                    }
            }
    
        });
    jQuery('.styled-input-single>input').change(function() {
        $key = jQuery(this).data('key');
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
    })
     
   });
}
</script>