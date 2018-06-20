<?php

/*
 * Plugin Name:     Acme5 Image Map
 * Description:     Creates a sleek image map of Acme5 products used in a project
 * Version:         0.0.1 (Beta)
 * Author:          Ben Toth
 * Author URI:      http//www.ben-toth.com
 * License:         GPL2
 * Class:           bt_imagemap
 * Text Domain:     bt-imagemap 
*/

defined( 'ABSPATH' ) OR exit;

if ( ! class_exists( 'bt_imagemap' ) ) {
    
    // instatiate plugin via WP plugins_loaded - init is too late for CPT ##
    add_action( 'plugins_loaded', array ( 'bt_imagemap', 'get_instance' ), 5 );
    
    class bt_imagemap {
                
        // Refers to a single instance of this class. ##
        private static $instance = null;
                       
        // Plugin Settings
        const version = '0.0.1';
        static $debug = true;
        //Settings / basic config
        const register_post_type = 'project'; //default false - will the plugin create a new post type?;
        const meta_boxes = 'tgm';//class that adds meta boxes
        const text_domain = 'bt-imagemap'; // for translation ##
        const map_width = 1024; //MANDATORY - this is the height and width the image was mapped at and needed to make resizable and responsive
        const map_height = 1024;

        /**
         * Creates or returns an instance of this class.
         *
         * @return  Foo     A single instance of this class.
         */
        public static function get_instance() 
        {

            if ( null == self::$instance ) {
                self::$instance = new self;
            }

            return self::$instance;

        }
        
        
        /**
         * Instantiate Class
         * 
         * @since       0.2
         * @return      void
         */
        private function __construct() 
        {
            
            // activation ##
            register_activation_hook( __FILE__, array ( $this, 'register_activation_hook' ) );

            // deactvation ##
            register_deactivation_hook( __FILE__, array ( $this, 'register_deactivation_hook' ) );

            // set text domain 
            add_action( 'init', array( $this, 'load_plugin_textdomain' ), 1 );
            
            // load properties ##
            #self::load_properties();

            // load libraries ##
            self::load_libraries();

        }


        // the form for sites have to be 1-column-layout
        public function register_activation_hook() {

            \add_option( self::text_domain, true );

        }


        public function register_deactivation_hook() {

            \delete_option( self::text_domain );

        }


        
        /**
         * Load Text Domain for translations
         * 
         * @since       1.7.0
         * 
         */
        public function load_plugin_textdomain() 
        {
            
            // set text-domain ##
            $domain = self::text_domain;
            
            // The "plugin_locale" filter is also used in load_plugin_textdomain()
            $locale = apply_filters('plugin_locale', get_locale(), $domain);

            // try from global WP location first ##
            load_textdomain( $domain, WP_LANG_DIR.'/plugins/'.$domain.'-'.$locale.'.mo' );
            
            // try from plugin last ##
            load_plugin_textdomain( $domain, FALSE, plugin_dir_path( __FILE__ ).'library/language/' );
            
        }
        
        
        
        /**
         * Get Plugin URL
         * 
         * @since       0.1
         * @param       string      $path   Path to plugin directory
         * @return      string      Absoulte URL to plugin directory
         */
        public static function get_plugin_url( $path = '' ) 
        {

            return plugins_url( $path, __FILE__ );

        }
        
        
        /**
         * Get Plugin Path
         * 
         * @since       0.1
         * @param       string      $path   Path to plugin directory
         * @return      string      Absoulte URL to plugin directory
         */
        public static function get_plugin_path( $path = '' ) 
        {

            return plugin_dir_path( __FILE__ ).$path;

        }
        


        /**
        * Load Libraries
        *
        * @since        2.0
        */
		private static function load_libraries()
        {

            // methods ##
            require_once self::get_plugin_path( 'library/core/helper.php' );
            require_once self::get_plugin_path( 'library/core/core.php' );


            // backend ##
            require_once self::get_plugin_path( 'library/admin/admin.php' );
            require_once self::get_plugin_path( 'library/admin/ajax.php' );
            
            // backend conditionals 
            if( self::register_post_type ) {
                require_once self::get_plugin_path( 'library/admin/register_post_type.php' );
                if( self::meta_boxes ){
                    require_once self::get_plugin_path( 'library/admin/'.self::meta_boxes.'.php' );
                }
            }
            
            // widgets for template ##
            require_once self::get_plugin_path( 'library/theme/widget/widget.php' );

            

            // frontend ##
            require_once self::get_plugin_path( 'library/theme/theme.php' );

        }

    }

}