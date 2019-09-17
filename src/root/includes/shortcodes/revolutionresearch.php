<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Revolution Research Logo 
 * example: [revolutionresearch link="/donate/" newtab]
 */
add_shortcode( 'revolutionresearch', 'revolutionresearch_shortcode' );
function revolutionresearch_shortcode( $attributes = [], $content = null, $tag = '' ){
    // normalize attribute keys, lowercase
    $attributes = array_change_key_case((array)$attributes, CASE_LOWER);
 
    // override default attributes with user attributes
    $attributes = shortcode_atts([
        'link' => '/stiftungszweck/',
        'newtab' => '0'
    ], $attributes, $tag);

    $link = esc_html($attributes['link']);
    if ($link === '' || $link === ' ') {
        $href = '';
    } else {
        $href = "href='$link'";
    }

    $target = '_self';
    if ($attributes['newtab'] === '1') {
       $target = '_blank'; 
    }

    // $href must come at last or the space before and after the href attribute
    // will be completly removed if $href is empty
    $html = "
        <a class='revolutionresearch' target='$target' $href>
            REVOLUTION
            <span>RESEARCH.</span>
        </a>
    ";

    // remove all line breaks, tabs and multiple spaces to avaoid auto generated spaces
    return preg_replace(['/\s{2,}/', '/[\t\n]/'], '', $html);
}
