<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


/**
 * Event filter inputs
 */
add_shortcode( 'events_filter', 'events_filter_func' );
function events_filter_func( $attributes, $content ){
    $events = get_posts([ 'post_type' => 'activism', 'posts_per_page' => -1 ]);
    
    $cities = $artists = $categories = [];
    foreach ($events as $event) {
        $post_id = $event->ID;
        
        $raw_categories = wp_get_post_terms($post_id, 'event_category');
        $_categories = array_map(function($category) {
            return $category->slug;
        }, $raw_categories);

        if (count($_categories) > 0) {
            $categories = array_merge($categories, $_categories);
        }

        $city = get_field('city', $post_id);
        if ($city) {
            array_push($cities, $city);
        }
        
        $artist = get_field('artist', $post_id);
        if ($artist) {
            array_push($artists, $artist);
        }
    }

    // $categories = ['wissenschaft', 'kunst', 'politik'];
    // $artists = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    // $cities = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];

    $category_options = generate_options(array_unique($categories));
    $artist_options = generate_options(array_unique($artists));
    $city_options = generate_options(array_unique($cities));

    return "
        <form action='/activism/#activism' id='events-filter'>
            <div class='input-group'>
                <label for='event-filter-categories'>Nach Thema filtern</label>
                <select name='category' id='event-filter-categories'>
                    <option value=''>Alle Themen</option>
                    $category_options
                </select>
            </div>
            <div class='input-group'>
                <label for='event-filter-artists'>Nach Künstler filtern</label>
                <select name='artist' id='event-filter-artists'>
                    <option value=''>Alle Künstler</option>
                    $artist_options
                </select>
            </div>
            <div class='input-group'>
                <label for='event-filter-cities'>Nach Ort filtern</label>
                <select name='city' id='event-filter-cities'>
                    <option value=''>Alle Orte</option>
                    $city_options
                </select>
            </div>
            <div class='input-group'>
                <label for='event-filter-date'>Nach Datum filtern</label>
                <input type='date' name='date' id='event-filter-date'>
            </div>
        </form>
    ";
}


/**
 * Generate html option string helper function
 */
function generate_options($option_data)  {
    $options = '';
    foreach ($option_data as $option) {
        $label = ucfirst($option);
        $options .=  "<option value='$option'>$label</option>";
    }
    return $options;
}
