<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}


/**
 * User post submit handler
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
    if (strlen($content) <= 0) {
        if ($media_type === 'image' && $image['size'] === 0) {
            sent_error('NO_CONTENT_OR_IMAGE');
        }
        else if ($media_type === 'image' && !validate_image($image)) {
            sent_error('IMAGE_TO_BIG_OR_WRONG_FORMAT');
        }
        else if ($media_type === 'youtube' && !$youtube) {
            sent_error('NO_CONTENT_OR_YOUTUBE');
        }
        else if (!in_array($media_type, ['image', 'youtube'])) {
            sent_error('UNSUPPORTED_MEDIA_TYPE');
        }
    }

    // create post title
    $title = 'DU-Beitrag';
    if ($media_type === 'image' && $image['size'] > 0) {
        $title .= ' [Bild]';
    } else if ($media_type === 'youtube' && $youtube){
        $title .= ' [YouTube]';
    }

    $clean_content = '';
    if (strlen($content) > 0) {
        // escape content
        $clean_content = sanitize_textarea_field($content);

        $max_content_length = 50;
        $content_excerpt = substr($clean_content, 0, $max_content_length);
        $title .= ": \"$content_excerpt";
        $title .= (strlen($clean_content) > $max_content_length) ? '..."' : '"';
    }

    $clean_youtube_url = '';
    if ($media_type === 'youtube') {
        $clean_youtube_url = sanitize_text_field($youtube);
    }

    // create new post
    $post_data = array(
        'post_type' => 'post',
        'post_status' => 'pending', // post is pending review
        'post_category' => [21], // 21: du-beitrag
        'post_title' => $title,
        'post_content' => $clean_content,
        'meta_input' => [
            'youtube_url' => $clean_youtube_url
        ]
    );

    $post_id = wp_insert_post( $post_data );

    if ( is_wp_error( $post_id ) ) {
        sent_error('CREATE_POST_FAILED');
    }

    if ($media_type === 'image' && $image['size'] > 0) {
        // These files need to be included as dependencies when on the front end.
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        require_once( ABSPATH . 'wp-admin/includes/file.php' );
        require_once( ABSPATH . 'wp-admin/includes/media.php' );

        // upload image
        $image_files_key = 'image'; // name of the image input field and key in $_FILES object
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


/**
 * Validate image helper function
 */
function validate_image($image) {
    $validextensions = array("jpeg", "jpg", "png", "gif");
    $temporary = explode(".", $image["name"]);
    $file_extension = end($temporary);

    return (
        (
            $image["type"] == "image/png" ||
            $image["type"] == "image/jpeg" ||
            $image["type"] == "image/gif"
        ) &&
        $image["size"] < 4194304 && // ~ 4 MB 
        // $image["size"] < 194304 && // ~ 0,2 MB 
        in_array($file_extension, $validextensions)
    );
}


/**
 * Error response helper function
 */
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
        case 'UNSUPPORTED_MEDIA_TYPE':
            $error ='Unsupported media type';
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
