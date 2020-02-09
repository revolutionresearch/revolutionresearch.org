# RevolutionResearch

WordPress theme for ProjektZukunft based on the [elementor-hello](https://github.com/elementor/elementor-hello-theme) theme

## Instructions
* install [node.js](https://nodejs.org/en/) version 10.0.0 or higher
* run `npm install` as admin to install gulp dependencies
* run `npm run watch` to watch file changes with gulp
* run `npm run build` to compile all source files
* upload the content of `./build` to the theme folder on the server (`/wordpress/wp-content/themes/amazoner`)

## Styling
All styles are written in SCSS inside `./src/styles` and compiled to a single styles.css.

## JavaScript
All JavaScript files inside `./src/js` are compiled with babel and bundeled with webpack to one main.js.

## PHP and other root files
All files inside `./src/root` are copied to `./build` without any further processing.

## Images
All images inside `./src/img` are minimized.
