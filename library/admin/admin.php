<?php

namespace bt\bt_imagemap\admin;
use bt\bt_imagemap\core\core as core;
use bt\bt_imagemap\core\helper as helper;


// load it up ##
\bt\bt_imagemap\admin\admin::run();

class admin extends \bt_imagemap {

    public static $screen = false;

    public static function run()
    {

        if ( \is_admin() ) {

            \add_action( 'admin_menu', array( get_class(), 'admin_menu')  );

            \add_action( 'admin_enqueue_scripts', array( get_class(), 'admin_enqueue_scripts' ), 10, 1 );

            \add_action( 'after_setup_theme', array( get_class(), 'add_image_sizes' ) );

        }            

    }


    public static function admin_menu() 
    {
    
        #self::$screen = \add_options_page( '', '', '', '', array( get_class(), 'admin_menu_page' ) );
        #Will there be an Appearance > Options page?

    }


    public static function admin_menu_page()
    {	


    }
    public static function add_image_sizes()
    {
        if(!self::register_post_type || !self::map_width || !self::map_height) {
            //bail
            if(self::$debug) helper::log('Failed to load image sizes for bt_imagemap plugin');
            return false;
        }
        \add_theme_support( 'post-thumbnails' );
        \add_image_size( self::register_post_type, self::map_width, self::map_height, array( 'center', 'top' ) );
    }
    public static function admin_enqueue_scripts( $hook_suffix )
    {

       # if ( $hook_suffix != self::$screen ) {
         
            // helper::log( 'Wrong screen...' );

        #    return false;

        #}
        #basic /admin/css/plugin-admin.css file enqueue
        \wp_register_style( self::text_domain.'-admin-css', helper::get( "theme/css/". self::text_domain."-admin.css", 'return' ), '', self::version, 'all' );		
        \wp_enqueue_style( self::text_domain.'-admin-css' );
        
        #plugin admin style dependencies here
        \wp_register_style ( 'featherlight-css', helper::get("theme/css/featherlight.min.css", 'return'), '', '1.7.12', 'all' );
        \wp_enqueue_style( 'featherlight-css');
        
        \wp_register_style ( 'fontawesome-css', helper::get("theme/css/fa-svg-with-js.css", 'return'), '', '5.0.9', 'all' );
        \wp_enqueue_style( 'fontawesome-css');
       
        #plugin admin js dependencies here
        \wp_register_script( 'featherlight', helper::get("theme/javascript/featherlight.min.js", 'return'), array('jquery'), '1.7.12' );
        \wp_enqueue_script( 'featherlight');

        
        \wp_register_script('fontawesome', helper::get("theme/javascript/fontawesome-all.min.js", 'return'), array( 'jquery'), '5.0.9');
        \wp_enqueue_script('fontawesome');

        \wp_register_script( 'maphilight', helper::get("theme/javascript/maphilight.js", 'return'), array('jquery'), '1.4.0');
        \wp_enqueue_script( 'maphilight' );

        //AND The other front-end js imagemap plugin -- will fully support one or the other in the future
        \wp_register_script( 'mapster', helper::get("theme/javascript/mapster.js", 'return'), array('jquery'), '1.4.0');
        \wp_enqueue_script( 'mapster' );


        // add JS ## -- after all dependencies ##
        \wp_enqueue_script( self::text_domain.'admin-js', helper::get( "theme/javascript/".self::text_domain."-admin.js", 'return' ), array( 'jquery', 'featherlight', 'maphilight', 'fontawesome' ), self::version );        
        
        \wp_register_script('image-editor', helper::get("theme/javascript/image-editor.js", 'return'), array( 'maphilight', 'jquery','featherlight', 'fontawesome'), '1');
        \wp_enqueue_script( 'image-editor' );


        // send debug variable to your base admin-js file for conditional logging ##
        // this is more handy for front-end but good for adding any constants you need your JS to access
        
        $php_friendly_text_domain = strtolower(str_replace('-','_',self::text_domain) ); 

        \wp_localize_script( self::text_domain.'admin-js', $php_friendly_text_domain, array(
            'ajaxurl'           => \admin_url( 'admin-ajax.php', \is_ssl() ? 'https' : 'http' ), 
            'debug'             => self::$debug,
        ));

   
    }


	
	public static function bt_config(){

?> <!--
        <h2>Image Map settings: </h2>
        <ul class="settings"> IF THIS WERE REAL IT WOULD BE A FORM BUT FOR NOW PLACEHOLDER
            
<li>altImageOpacity:</li> 0.7,
<li>fill:</li> true,
<li>fillColor:</li> '000000',
<li>fillColorMask:</li> 'FFFFFF',
<li>fillOpacity:</li> 0.5,
<li>stroke:</li> false,
<li>strokeColor:</li> 'ff0000',
<li>strokeOpacity:</li> 1,
<li>strokeWidth:</li> 1,
    </ul>
<p id="cc_reset_response"></p>
        <button class="button-primary" id="cc_reset">Reset</button>
<?php

		
    }


}
