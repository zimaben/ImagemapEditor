if(typeof jQuery !== 'undefined'){
    jQuery(document).ready(function(){
        if(jQuery('.tgm-remove-project').length ) {
            jQuery('.tgm-remove-project').click(function(){
                $postid = jQuery(this).data('postid');
                console.log($postid);
                jQuery.post(//ajaxurl global available for admin pages without localizing
                    ajaxurl, 
                    {
                        'action': 'delete_project',
                        'ajaxID': $postid
            
                    }   
                )
                .done( function(){
                    location.reload();
                });
                
            });
        }
        
    });

}