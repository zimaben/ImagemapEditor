<?php

namespace bt\bt_imagemap\admin;
use bt\bt_imagemap\core\core as core;
use bt\bt_imagemap\core\helper as helper;


// load it up ##
\bt\bt_imagemap\admin\post_type::run();

class post_type extends \bt_imagemap {

    public static function run()
    {
        
        \add_action( 'init', array( get_class(),'create_posttype'), 10,3 );
        

 
    }
    
    public static function create_posttype( ) {
        if( self::register_post_type ){
            $post_type = self::make_post_type( self::register_post_type );
            $post_types = self::pluralize( $post_type );
            $theme = \wp_get_theme();
        } else { $post_type = false; }    
        
        if($post_type)
        {
    // Set UI labels for Custom Post Type
        $labels = array(
            'name'                => $post_types, 'Post Type General Name',
            'singular_name'       => $post_type, 'Post Type Singular Name',
            'menu_name'           =>  $post_types, 
            'parent_item_colon'   =>  'Parent '.$post_type, 
            'all_items'           =>  'All '.$post_types,
            'view_item'           =>  'View '.$post_type,
            'add_new_item'        =>  'Add New '.$post_type,
            'add_new'             =>  'Add New', 
            'edit_item'           =>  'Edit '.$post_type,
            'update_item'         => 'Update '.$post_type,
            'search_items'        => 'Search '.$post_type,
            'not_found'           => 'Not Found',
            'not_found_in_trash'  => 'Not found in Trash',
        );
         
    // Set other options for Custom Post Type
         
        $args = array(
            'label'               =>  strtolower($post_type),
            'description'         => '',
            'labels'              => $labels,
            // Features this CPT supports in Post Editor
            'supports'            => array( 'title',
                                            'editor', 
                                            'excerpt', 
                                            //'author', 
                                            //'thumbnail', 
                                            //'comments', 
                                            'revisions', 
                                            //'custom-fields', 
                                        ),
            // You can associate this CPT with a taxonomy or custom taxonomy. 
            'taxonomies'          => array( 'category' ),
            /* A hierarchical CPT is like Pages and can have
            * Parent and child items. A non-hierarchical CPT
            * is like Posts.
            */ 
            'hierarchical'        => false,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_nav_menus'   => true,
            'show_in_admin_bar'   => true,
            'menu_position'       => 5,
            'can_export'          => true,
            'has_archive'         => strtolower($post_types),
            'exclude_from_search' => false,
            'publicly_queryable'  => true,
            'capability_type'     => 'page',
        );
         
        // Registering your Custom Post Type
        \register_post_type( $post_type, $args );
    }
    
    
    }
    
    public static function make_post_type( $name ) {
        //start simple
        $fancy_name = ucfirst(strtolower( $name ) );
    return $fancy_name;
    }
    public static function pluralize( $singular ) {
        //start simple
        $plural = $singular.'s';
    return $plural;
    }
    
    /* Hook into the 'init' action so that the function
    * Containing our post type registration is not 
    * unnecessarily executed. 
    */
    

}