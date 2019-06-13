<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


require_once(__DIR__ . '/utils.php');
require_once(__DIR__ . '/social_wall_controller.php');
require_once(__DIR__ . '/rating_controller.php');


/** ROUTES */

add_action('rest_api_init', function () {
	register_rest_route('zukunft/v1', '/social-wall', array(
		'methods' => 'GET',
		'callback' => 'get_posts_for_social_wall',
	));

	register_rest_route('zukunft/v1', '/flockler/(?P<id>\d+)/rating', array(
		'methods' => 'POST',
		'callback' => 'add_rating',
	));
	register_rest_route('zukunft/v1', '/flockler/(?P<id>\d+)/rating', array(
		'methods' => 'delete',
		'callback' => 'remove_rating',
	));
	register_rest_route('zukunft/v1', '/flockler/(?P<id>\d+)/rating', array(
		'methods' => 'PUT',
		'callback' => 'update_rating',
	));
});


/** HANDLER */

function get_posts_for_social_wall( $request ) {
	$page = $request->get_param('page');
	return social_wall_controller($page);
}

function add_rating( $request ) {
	$value = $request->get_param('value');
	$id = $request->get_param('id');

	add_rating_controller($value, $id);

	return [
		'rating_value' => get_field('rating_value', $id),
		'rating_count' => get_field('rating_count', $id)
	];
}

function remove_rating( $request ) {
	$value = $request->get_param('value');
	$id = $request->get_param('id');

	remove_rating_controller($value, $id);

	return [
		'rating_value' => get_field('rating_value', $id),
		'rating_count' => get_field('rating_count', $id)
	];
}

function update_rating( $request ) {
	$old_value = $request->get_param('old_value');
	$new_value = $request->get_param('new_value');
	$id = $request->get_param('id');

	update_rating_controller($old_value, $new_value, $id);

	return [
		'rating_value' => get_field('rating_value', $id),
		'rating_count' => get_field('rating_count', $id)
	];
}