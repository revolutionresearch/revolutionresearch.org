<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Order events by custom date field
 */
add_action( 'elementor/query/events_by_date', function( $query ) {
    $query->set( 'meta_key', 'date' );
    $query->set( 'meta_type', 'DATE' );
    $query->set( 'orderby', 'meta_value' );
});


/**
 * Order events by custom date field and filter by get paramaters
 */
add_action( 'elementor/query/events_filtered', function( $query ) {
    // order by date
    $query->set( 'meta_key', 'date' );
    $query->set( 'meta_type', 'DATE' );
    $query->set( 'orderby', 'meta_value' );

    // filter by category
    if (isset($_GET['category']) && $_GET['category'] !== '') {
        $query->set('tax_query', [[
            'taxonomy' => 'event_category',
            'field'    => 'slug',
            'terms'    => $_GET['category']
        ]]);
    }

    $meta_query = [];

    // filter by artist
    if (isset($_GET['artist']) && $_GET['artist'] !== '') {
        $meta_query[] = [
            'key' => 'artist',
            'value' => $_GET['artist'],
            'compare' => '='
        ];
    }

    // filter by city
    if (isset($_GET['city']) && $_GET['city'] !== '') {
        $meta_query[] = [
            'key' => 'city',
            'value' => $_GET['city'],
            'compare' => '='
        ];
    }
    
    // filter by date
    if (isset($_GET['date']) && $_GET['date'] !== '') {
        $date_regex = $_GET['date'] . '[0-9]{1,2}';
        $meta_query[] = [
            'key' => 'date',
            'value' => $date_regex,
            'compare' => 'REGEXP'
        ];
    }

    $query->set( 'meta_query', $meta_query );
});
