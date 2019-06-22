<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}


/**
 * Wolfram Alpha Request
 */
add_action('wp_ajax_simple_wa_api_request', 'simple_wa_api_request');
add_action('wp_ajax_nopriv_simple_wa_api_request', 'simple_wa_api_request');
function simple_wa_api_request() {
    $app_id = '9G45XV-5W3KPX5WQH';
    // $query = rawurlencode(str_replace('+','%2B', $_POST['query']));
    $query = rawurlencode($_POST['query']);
    $url = "http://api.wolframalpha.com/v2/query?input=$query&appid=$app_id&format=image&maxwidth=600";

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    $result = curl_exec($curl);
    curl_close($curl);

    echo $result;
    wp_die(); // this is required to terminate immediately and return a proper response
}
