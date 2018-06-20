<?php

#namespace bt\bt_imagemap\admin;  

use bt\bt_imagemap\core\helper as helper;
use bt\bt_imagemap\core\core as core;
use bt\bt_imagemap\theme\theme as theme;

/**
 * Widget - Template
 *
 * @since       2.0.0
 */

if ( ! class_exists( 'bt_widget_my_widget' ) )
{


    class bt_widget_my_widget extends \WP_Widget
    {

        /**
        * Register widget with WordPress.
        */
        public function __construct(  ) {

            parent::__construct(
                'bt_widget_example', // Base ID
                'Example Widget', // Name
                array( 'description' => 'This plugin requires a widget.', '', ) // Args
            );

        }



        /**
        * Front-end display of widget.
        *
        * @see WP_Widget::widget()
        *
        * @param array $args     Widget arguments.
        * @param array $instance Saved values from database.
        */
        public function widget( $args, $instance ) {
                
            // get widget settings ##
            $title = $instance['example'] ? $instance['example'] : 'default';
            $this->settings["example"] = \apply_filters( 'bt_widget_example', $example );

            // check if widget settings ok ##
            if ( isset( $this->settings ) && array_filter( $this->settings ) ) {

                // render widget ##
                theme::render();

            } // setting ok ##

        }


	
        /**
        * Sanitize widget form values as they are saved.
        *
        * @see WP_Widget::update()
        *
        * @param array $new_instance Values just sent to be saved.
        * @param array $old_instance Previously saved values from database.
        *
        * @return array Updated safe values to be saved.
        */
        public function update( $new_instance, $old_instance ) {

            $instance = array();
            $instance['example'] = ( ! empty( $new_instance['example'] ) ) ? strip_tags( $new_instance['example'] ) : '' ;
            return $instance;

        }



        /**
        * Back-end widget form.
        *
        * @see WP_Widget::form()
        *
        * @param array $instance Previously saved values from database.
        */
        public function form( $instance ) {

            $example = isset( $instance[ 'example' ] ) ? $instance[ 'example' ] : core::properties("example") ;


?>
            <p>
                <label for="<?php echo $this->get_field_id( 'example' ); ?>"><?php _e( 'Example:' ); ?></label>
                <input class="widget_inpput" id="<?php echo $this->get_field_id( 'example' ); ?>" name="<?php echo $this->get_field_name( 'example' ); ?>" type="text" value="<?php echo esc_attr( $example ); ?>">
            </p>
            
<?php


        }

    }

}