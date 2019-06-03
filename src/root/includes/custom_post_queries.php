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
