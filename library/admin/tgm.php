<?php
namespace bt\bt_imagemap\admin;
use bt\bt_imagemap\core\core as core;
use bt\bt_imagemap\core\helper as helper;
/*
Plugin Name: TGM New Media Plugin
Plugin URI: http://thomasgriffinmedia.com/
Description: This plugin gives an example of how to customize the new media manager experience in WordPress 3.5.
Author: Thomas Griffin
Author URI: http://thomasgriffinmedia.com/
Version: 1.0.0
License: GNU General Public License v2.0 or later
License URI: http://www.opensource.org/licenses/gpl-license.php
*/



/**
 * Main class for the plugin.
 *
 * @since 1.0.0
 *
 * @package TGM New Media Plugin
 * @author  Thomas Griffin
 */

 \bt\bt_imagemap\admin\tgm::run();
 
class tgm extends \bt_imagemap {


    public static function run() {

        // Load the plugin textdomain.
        #\load_plugin_textdomain( 'tgm-nmp', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

        // Load our custom assets.
        \add_action( 'admin_enqueue_scripts', array( get_class(), 'assets' ) );

        // Generate the custom metabox to hold our example media manager.
        \add_action( 'add_meta_boxes', array( get_class(), 'add_meta_boxes' ) );

        // Save the project editor data
        #\add_action( 'wp_ajax_save_project', array( get_class(), 'save_project' )) ;
        \add_action( 'save_post_project', array( get_class(), 'save_project') );

        \add_action( 'wp_ajax_delete_project', array(get_class(), 'delete_project') );
        
        \add_action( 'admin_notices', array(get_class(), 'admin_notice'));
    }

    /**
     * Loads any plugin assets we may have.
     *
     * @since 1.0.0
     *
     * @return null Return early if not on a page add/edit screen
     */
    public static function assets() {

        // Bail out early if we are not on a page add/edit screen.
        if ( ! ( 'post' == \get_current_screen()->base && self::register_post_type == \get_current_screen()->id  ) ) {
            #if(self::$debug) helper::log( '## DID NOT LOAD META BOXES FOR POST TYPE: '. \get_current_screen()->id );
            return;
        }
        // This function loads in the required media files for the media manager.
        \wp_enqueue_media();
        $title = 'Create a New Project';
        #$image_size = self::check_image_sizes( self::register_post_type );
        #if( count($image_size) >= 1 ) $title.=' - Minimum '.$image_size['width'].'px Image Required.';
        $title.=' - Minimum '.self::map_width.'px Image Required.';

        // Register, localize and enqueue our custom JS.
        \wp_register_script( 'tgm-nmp-media', self::get_plugin_url( 'library/theme/javascript/media.js' ), array( 'jquery', 'featherlight', 'maphilight' ), '1.0.0', true );
        \wp_localize_script( 'tgm-nmp-media', 'tgm_nmp_media', 
            array(
                'title'     =>  $title,  // This will be used as the default title
                'button'    => 'Create Project',  // This will be used as the default button text
                'meta_name'    => 'map',   // This is the post_meta type we are creating with the upload           
                'custom_image_size' => array( 
                        'width' => self::map_width,
                        'height' => self::map_height ),
                'debug' => self::$debug
            )
        );
        \wp_enqueue_script( 'tgm-nmp-media');

        #IF post has attached imagemaps we can enqueue save/edit functions
        $postid = isset( $_GET['post'] ) ? $_GET['post'] : false;
        if($postid) :
            $bt_img = \get_post_meta( $postid, 'bt_image_map', true );
            $bt_list = \get_post_meta( $postid, 'bt_image_list', true);
            if( $bt_img || $bt_list) :
                #ajax save/edit functions
                \wp_register_script( 'delete-project-js', self::get_plugin_url( 'library/theme/javascript/delete_project.js' ), array( 'jquery' ), '1.0.0', true ); 
                \wp_register_script( 'edit-project-js', self::get_plugin_url( 'library/theme/javascript/edit_project.js' ), array( 'jquery', 'featherlight', 'maphilight', 'tgm-nmp-media'  ), '1.0.1', true ); 

                \wp_localize_script( 'edit-project-js', 'edit_project', 
                    array(
                        'postid'    => isset( $_GET['post'] ) ? $_GET['post'] : 0,
                        'img'       => $bt_img,
                        'list'      => $bt_list,
                        'custom_image_size' => array( 
                                'width' => self::map_width,
                                'height' => self::map_height ),
                        'debug' => self::$debug
                    )
                );
                \wp_enqueue_script('delete-project-js'); //No localizing...we don't need any variables to delete
                \wp_enqueue_script('edit-project-js');
            endif;
        endif;
    }
    public static function check_image_sizes( $name) {
        global $_wp_additional_image_sizes;
        $match = false;
        foreach( $_wp_additional_image_sizes as $k=>$v){
            if(  $name == $k ){
                $match = $v;
            }
        }
        return $match;
    }
    public static function delete_project(){
        $message = 'Could not delete map';
        $postid = isset($_POST['ajaxID']) ? $_POST['ajaxID'] : false;
        helper::log('ajaxID: '.$postid);
        if($postid) :
            $delmap = \delete_post_meta( $postid, 'bt_image_map' ); // no need to check, this should delete everything for the post if it exists if not no biggie
            $dellist = \delete_post_meta( $postid, 'bt_image_list' );
        endif;
        if($delmap || $dellist) :
            $message = 'Project Map successfully deleted';
            \update_post_meta( $postid, 'bt_notice', $message);

        endif;
        

        return '{'.$message.'}';
        \wp_die(); //AJAX must die!!! 
    }

    public static function admin_notice( ){
        if( array_key_exists('post', $GLOBALS) ) :
            $postid = isset( $_GET['post'] ) ? $_GET['post'] : false;
            $message = \get_post_meta($postid, 'bt_notice', true );
            if( $message ){ //WE ONLY LOG SUCCESS MESSAGES IN THIS PLUGIN
                ?> 
                <div class="notice notice-success is-dismissible">
                   <p> <?php echo $message ?> </p>
                </div>
                <?php
                \delete_post_meta( $postid, 'bt_notice');//MESSAGE SHOWN ONCE
            }

        endif;
    }

    public static function save_project() {
        // return if autosave
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ){
            return;
        }   
        $map = isset($_POST['map_data']) ? $_POST['map_data'] : false ;
        $list = isset($_POST['list_data']) ? $_POST['list_data'] : false ;
        if($map && $list ){
            global $post;

            $map = str_replace('Map\"', 'Map'.$post->ID.'\"', $map);
            $map = str_replace('id=\"bt_imagemap\"', 'id=\"bt_imagemap'.$post->ID.'\"', $map);

            $list = str_replace('id=\"set_list\"', 'id=\"set_list'.$post->ID.'\" data-tgt=\"#Map'.$post->ID.'\" ', $list );
            #helper::log('$list new value: ' .$list);
            $message = "Created a Project Image Map";
            \update_post_meta( $post->ID, 'bt_image_map', $map );
            \update_post_meta( $post->ID, 'bt_image_list', $list);
            \update_post_meta( $post->ID, 'bt_notice', $message);
        } else if( $map || $list ){
            if(self::$debug) helper::log(' - Project Image Map and Project Set List do not Match.');
        }

    }
    /**
     * Create the custom metabox.
     *
     * @since 1.0.0
     */
    public static function add_meta_boxes() {

        // This metabox will only be loaded for self::register_post_type.
        \add_meta_box( 'tgm-new-media-plugin', 'Add a Project Image Map', array( get_class(), 'metabox' ), self::register_post_type, 'side', 'high' );

    }

    /**
     * Callback function to output our custom settings page.
     *
     * @since 1.0.0
     *
     * @param object $post Current post object data
     */
    public static function metabox( $post ) {
        $postid = isset( $_GET['post'] ) ? $_GET['post'] : false;
        if(self::$debug) helper::log('Loading metabox for Post:'.$postid);
        if($postid){ $has_project = \get_post_meta($postid, 'bt_image_map'); } else { $has_project = false; }
        if($postid && $has_project){
        echo '<div id="tgm-new-media-settings">';
        echo '<p>This post already has a Project Image Map.</p>';
        echo '<p><strong>Click Remove Map to take the current Project offline.</strong></p>';
        echo '<p><a href="#" class="tgm-remove-project button button-primary" data-postid="'.$postid.'" title="Remove Image Map">Remove Map</a></p>';
        echo '<p><a href="#" class="tgm-edit-project button button-primary" data-postid="'.$postid.'" title="Edit Image Map">Edit Map</a></p>';
        
        # echo '<p><label for="tgm-new-media-image">' . 'Upload new Project', 'tgm-nmp' . '</label> <input type="text" id="tgm-new-media-image" value="" /></p>';
        echo '<input type="hidden" name="project" id="project" value="" />';
        echo '<input type="hidden" name="map_data" id="map_data" value="" />';
        echo '<input type="hidden" name="list_data" id="list_data" value="" />';
        echo '<div id="mapEditor"></div>';
        echo '</div>'; 

        } else {
            global $_wp_additional_image_sizes;
            echo '<div id="tgm-new-media-settings">';
            echo '<p>Acme5 Projects Images are a custom map of a project and links to the pages of each set piece.</p>';
            echo '<p><strong>Upload an image to start our Project Editor.</strong></p>';
            echo '<p><a href="#" class="tgm-open-media button button-primary" title="Add Image">Add Image</a></p>';
            # echo '<p><label for="tgm-new-media-image">' . 'Upload new Project', 'tgm-nmp' . '</label> <input type="text" id="tgm-new-media-image" value="" /></p>';
            echo '<input type="hidden" name="project" id="project" value="" />';
            echo '<input type="hidden" name="map_data" id="map_data" value="" />';
            echo '<input type="hidden" name="list_data" id="list_data" value="" />';
            echo '<div id="mapEditor"></div>';
            echo '</div>';
        }

    }

}

