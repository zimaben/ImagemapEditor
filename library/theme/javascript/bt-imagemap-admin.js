// variables ## 
var debug = bt_imagemap.debug; //NOTE: Change variable name to match plugin dext domainS


if ( typeof jQuery !== 'undefined' ) {

    jQuery(document).ready(function() {
        //generic admin javascript here

        console.log('loading admin javascript');
        console.log( debug );

          

        });

}

//put helpful utility functions here
// http://stackoverflow.com/questions/2507030/email-validation-using-jquery
function is_valid_email(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

