<?php

namespace bt\bt_imagemap\admin;

use bt\bt_imagemap\core\helper as helper;
use bt\bt_imagemap\core\core as core;
// use bt\bt_imagemap\theme\theme as theme;

// load it up ##
\bt\bt_imagemap\admin\ajax::run();

class ajax extends \bt_imagemap {

    public static function run()
    {

        // ajax search calls ##
        #\add_action( 'wp_ajax_bt_imagemap', array( get_class(), 'email' ) );

    }


    /**
    * AJAX method for front-end form submissions
    *
    * @since    2.0.0
    */
    public static function email()
    {
        
		$baseurl = 'https://api.constantcontact.com/v2/'; //DIFFERENT THAN THE AUTH URL, v2 NEED TO SET UP IN CORE::PROPERTIES
		
        // start bad :) ##
        $return = array(
            'submitted' => false, // tracking for JS ##
            'message'   => 'Nothing submitted yet.', // for logs and debugging ##
            'email'     => false, // no email ##
            'response'  => false // full http response data ##
        );

        // grab stored option ##
        $q_connect_constant_contact = \get_option( 'q_connect_constant_contact', false );

        // grab passed email and clean it up ##
        $return['email'] = isset( $_POST['email'] ) ? \sanitize_email( $_POST['email'] ) : false ;

        

        // check nonce ##
        if ( ! \check_ajax_referer( 'bt-imagemap', 'nonce' ) ) {

            $return['message'] = 'Nonce failed ):';

            helper::log( $return['message'] );
            
            return $return;

        }

        // build header args for http request  ##
        $headers = array(
            'Authorization'     => 'Bearer '.$q_connect_constant_contact['auth_token'],
            'X-Originating-Ip'  => $_SERVER['SERVER_ADDR'],
            'Content-Type'      => 'application/json',
			'method'   			=> 'POST' 
        );
        
        // ###
        $url = $baseurl.'contacts?api_key='.$q_connect_constant_contact['api_key'].'&action_by=ACTION_BY_VISITOR';
		$body = '{"lists":[{"id":"'.core::properties('group').'"}],"email_addresses":[{"email_address":"'.$return['email'].'"}] }';
		
        	$resp = \wp_remote_post(
            $url, 
            array( 
                'headers'   => $headers, 
                'body'      => $body 
            ) 
        );

		
		#$resp = \wp_remote_post($url, array( 'headers'=>$headers, 'body' => $body ));
        
		if ( \is_wp_error($resp) ) {

			$return['response'] = false;
			$return['message'] = $resp->get_error_message();

		} else if ( ! isset($resp['body']) ){
			
            $return['response'] = false;
			$return['message'] = 'There was a problem adding your email to our list. No response given.';

		} else {

			$respCode = \wp_remote_retrieve_response_code($resp);
			
            if( $respCode && $respCode == '201' ) {
			
            	$return['response'] = true;
				$return['message'] = 'Thanks! Your email has been added to our mailing list.' ; 
				$return['submitted'] = true;
            
            } else if( $respCode && $respCode == '409' ) {

                $return['response'] = true;
                $return['message'] = 'Thanks! It looks like your email was already on our list.'; 
                
            } else if( $respCode && substr( $respCode,0,1 !== '2' ) ) {

				$respBody = \wp_remote_retrieve_body($resp); 
				$respArray = json_decode($respBody, true);
				$error = $respArray['error_message']; 
				helper::log($error);
           	    $return['response'] = true;
                $return['message'] = 'There was a problem adding your email to the list.' ; 
				
				
                
            }

		}

        #$return['headers'] = $headers;
        #helper::log( $return );

        // kick it back ##
        echo json_encode( $return );

        // all ajax calls must die!! ##
        die();

    }

}