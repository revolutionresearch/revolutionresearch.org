<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Wolfram Alpha Search Box
 */
add_shortcode( 'wolfram_alpha_search_box', 'wolfram_alpha_search_box_func' );
function wolfram_alpha_search_box_func( $attributes, $content ){    
    return "
        <div class='wa__search-box'>
            <form class='wa__form'>
                <input class='wa__input' type='text' placeholder='" . __('What is your question?') . "' />
                <button class='wa__submit' type='submit'></button>
            </form>
            <div class='wa__output'></div>
        </div>
    ";
}
