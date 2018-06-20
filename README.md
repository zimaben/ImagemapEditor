# Ben Toth - Naked Plugin  

This is my boilerplate for creating a new plugin.

## Getting Started

Follow these instructions to start the new plugin.
1. Set the variables and constants in the base template.
    a. Initial version should be 0.0.1 (Alpha)
    b. Set register_post_type constant if the plugin needs it's own post register_post_type, otherwise false
    c. Set meta_boxes constant to an array of meta boxes needed if the post type needs them, otherwise false. The register_post_type constant must have a true value for this to have any effect.
    d. Set text-domain. This is pretty important.
    e. Edit the comment text for your name and description.
    f. Set the debug variable to true.

2. After your base template file has been edited, rename the file to the text-domain value. Then go to the /library/theme/javascript/ folder and rename the base javascript files. They should be text-domain.js and text-domain-admin.js. Do the same thing in /library/theme/css/ for the css files. The enqueued files for an unmodified install are text-domain.css and text-domain-admin.css.

3. Do a plugin-wide search for namespace - update the namespacing on all the template files

With those steps completed, you should have a basic plugin install that generates no errors. You can check that the admin javascript is being included by checking the console for a log entry greeting and logging the debug variable (note: booleans are transferred from PHP to JS as a 1 or 0. Don't write js for $debug === true ). If you put a value in the register_post_type constant, you should see the post type on the menu in the admin section.


### Installing

Just pull or clone a fresh filetree into your wp-content/plugins directory of the project you are working on.



## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Q Studios](#) - The basic structure was learned by working in the Q Studios framework


## Authors

* **Ben Toth** - *Initial work* - [ben-toth.com](http://www.ben-toth.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


