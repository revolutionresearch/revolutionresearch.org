<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Shortcode to insert the table of contents container
 */
add_shortcode( 'table_of_contents', 'table_of_contents_func' );
function table_of_contents_func( $attributes, $content ){    
    return "
        <div class='toc-container'></div>
    ";
}
