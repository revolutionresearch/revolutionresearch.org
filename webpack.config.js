module.exports = {
    mode: 'development',
    output: {
        filename: 'main.js',
    },
    stats: 'errors-only',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: [
                    ['@babel/preset-env', {
                        'targets': {
                            'node': 'current',
                            // 'esmodules': true
                        }
                    }]
                ],
                plugins: ['@babel/plugin-proposal-object-rest-spread']
            },
        }]
    }
};
