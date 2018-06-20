<?php

namespace bt\bt_imagemap\theme;
use bt\bt_imagemap\core\helper as helper;
use bt\bt_imagemap\core\core as core;
use bt\bt_imagemap\admin\tgm as admin_media;

// load it up ##  
\bt\bt_imagemap\theme\theme::run();

class theme extends \bt_imagemap {

    public static function run()
    {

        if ( ! \is_admin() ) {

            // load scripts early, so theme files can override ##
            \add_action( 'wp_enqueue_scripts', array( get_class(), 'wp_enqueue_scripts' ), 2 );

        }

    }

  
    public static function wp_enqueue_scripts() {

        // Set Nonce ##
        $ajax_nonce = \wp_create_nonce( self::text_domain );

        \wp_register_style( self::text_domain.'-css', helper::get( "theme/css/".self::text_domain.".css", 'return' ), '', self::version, 'all' );
        \wp_enqueue_style( self::text_domain.'-css' );

        if(self::$debug) helper::log("theme/css/".self::text_domain.".css");

        // add JS ## -- after all dependencies ##
        \wp_enqueue_script( self::text_domain.'-js', helper::get( "theme/javascript/".self::text_domain.".js", 'return' ), array( 'jquery' ), self::version );
        
        $php_friendly_text_domain = strtolower(str_replace('-','_',self::text_domain) ); 
        // declare the URL to the file that handles the AJAX request (wp-admin/admin-ajax.php)
        \wp_localize_script( self::text_domain.'-js', $php_friendly_text_domain, array( 
            'ajaxurl'           => admin_url( 'admin-ajax.php', \is_ssl() ? 'https' : 'http' ),
            'nonce'             => $ajax_nonce,
            'debug'             => self::$debug,
            'imagesize'         => array('width' => self::map_width, 'height' => self::map_height )

        ) );

        // front-end js imagemap plugin 
        \wp_register_script( 'mapster', helper::get("theme/javascript/mapster.js", 'return'), array('jquery'), '1.4.0');
        \wp_enqueue_script( 'mapster' );

        // fontawesome
        \wp_register_style ( 'fontawesome-css', helper::get("theme/css/fa-svg-with-js.css", 'return'), '', '5.0.9', 'all' );
        \wp_enqueue_style( 'fontawesome-css');

        \wp_register_script('fontawesome', helper::get("theme/javascript/fontawesome-all.min.js", 'return'), array( 'jquery'), '5.0.9');
        \wp_enqueue_script('fontawesome');

    }


    /**
    * Render the front-end HTML
    *
    * @since        0.1
    * @return       String
    */
    public static function render( array $args = [] )
    {

        #if ( self::$debug ) helper::log($args);

        // default fields 
        $default = [ ];
        
        // validate fields - if you need validation logic##
        if ( ! $fields = core::validate_fields( $fields ) ) {

            if ( self::$debug ) helper::log( 'Failed field validation...' );

            return false;

        }
        // check which fields were requested ## 
        $fields = core::merge_fields( $args['fields'], $default );         

?>
        <!--Front end Markup -->
       
       <!-- <h2><?php echo 'The title'; ?></h2>
        <div id="this_plugin">
            <p> <?php echo 'The description'; ?> </p>

<?php

            foreach( $fields as $field ) {

                // field renderer ##
                self::render_field( $field );

            }

?>
        </div>
<?php 

    }

    public static function render_field( $field = null )
    {

        // sanity ##
        if ( is_null( $field ) ) {

            if ( self::$debug ) helper::log( 'Missing data' );

            return false;

        }

?>              
                <input class="<?php echo self::text_domain; ?>_input" name="<?php echo self::text_domain; ?>_<?php echo $field; ?>" id="<?php echo self::text_domain; ?>_<?php echo $field; ?>" value="" type="text" placeholder="" />
<?php
            
    } 

}