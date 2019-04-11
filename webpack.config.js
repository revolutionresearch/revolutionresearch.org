module.exports = {
    mode: 'development',
    output: {
        filename: 'main.js',
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: [
                    ['@babel/preset-env', {
                        "targets": {
                            "node": "current"
                        }
                    }]
                ]
            },
        }]
    }
};
