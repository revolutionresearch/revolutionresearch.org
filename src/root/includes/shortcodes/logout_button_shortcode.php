<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


add_shortcode( 'logout_button', 'logout_url_shortcode' );
function logout_url_shortcode() {
	if ( !is_user_logged_in() ) {
		return '';
	}
    
    // $current_url = get_the_permalink();
	$url = esc_url( wp_logout_url( 'https://revolutionresearch.org' ) );

	return "$styles <a href='$url' title='Logout' class='logout-button'>Logout</a>";
}
