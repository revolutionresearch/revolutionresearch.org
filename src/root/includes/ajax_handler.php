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


/**
 * User submitted post
 */
add_action('wp_ajax_user_post_submit', 'user_post_submit');
add_action('wp_ajax_nopriv_user_post_submit', 'user_post_submit');
function user_post_submit() {

    if (!isset($_POST)) {
        wp_die();
    }
    
    $content = $_POST['content'];
    $media_type = $_POST['media-type'];
    $youtube = $_POST['youtube'];
    $image = $_FILES['image'];

    // validation
    if (!sizeof($content)) {
        if ($media_type === 'image' && !$image) {
            sent_error('NO_CONTENT_OR_IMAGE');
        } else if ($media_type === 'image' && !validate_image($image)) {
            sent_error('IMAGE_TO_BIG_OR_WRONG_FORMAT');
        }
        else if ($media_type === 'youtube' && !$youtube) {
            sent_error('NO_CONTENT_OR_YOUTUBE');
        }
    }

    // create new post
    $post_data = array(
        'post_type' => 'post',
        'post_status' => 'pending', // post is pending review
        'post_category' => [21], // 21: du-beitrag
        'post_title' => 'DU-Beitrag',
        'post_content' => isset($content) ? $content : '',
        'meta_input' => [
            'youtube_url' => $media_type === 'youtube' ? $youtube : ''
        ]
    );

    $post_id = wp_insert_post( $post_data );

    if ( is_wp_error( $post_id ) ) {
        sent_error('CREATE_POST_FAILED');
    }

    if ($media_type === 'image') {
        // These files need to be included as dependencies when on the front end.
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        require_once( ABSPATH . 'wp-admin/includes/file.php' );
        require_once( ABSPATH . 'wp-admin/includes/media.php' );

        // upload image
        $image_files_key = 'image';
        $attachment_id = media_handle_upload( $image_files_key, 0 );
		
        if ( is_wp_error( $attachment_id ) ) {
            sent_error('UPLOAD_FAILED');
        }

        $image_url = wp_get_attachment_url( $attachment_id );

        // set image as post thumbnail
        set_post_thumbnail( $post_id, $attachment_id );
    }

    echo json_encode([
        'message' => 'success',
        'error' => null,
    ]);
    
    wp_die(); // this is required to terminate immediately and return a proper response
}

function validate_image($image) {
    $validextensions = array("jpeg", "jpg", "png", "gif");
    $temporary = explode(".", $image["name"]);
    $file_extension = end($temporary);

    return (
        (
            $image["type"] == "image/png, jpg, jpeg, gif" ||
            $image["type"] == "image/png, jpg, jpeg, gif" ||
            $image["type"] == "image/png, jpg, jpeg, gif" ||
            $image["type"] == "image/png, jpg, jpeg, gif"
        ) &&
        $image["size"] < 4194304 && // ~ 4 MB 
        // $image["size"] < 194304 && // ~ 0,2 MB 
        in_array($file_extension, $validextensions)
    );
}

function sent_error($error_key) {
    $error = '';

    switch ($error_key) {
        case 'NO_CONTENT_OR_IMAGE':
            $error ='No content or image found';
            break;
        case 'IMAGE_TO_BIG_OR_WRONG_FORMAT':
            $error ='Image to big (max 4 MB) or wrong format (only png, jpg, jpeg, gif)';
            break;
        case 'NO_CONTENT_OR_YOUTUBE':
            $error ='No content or YouTube link found';
            break;
        case 'CREATE_POST_FAILED':
            $error ='Post creation failed';
            break;
        case 'UPLOAD_FAILED':
            $error ='Upload failed';
            break;
        
        default:
            break;
    }

    echo json_encode([
        'message' => 'error',
        'error' => $error,
    ]);

    wp_die();
}
