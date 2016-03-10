//var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {

    entry: {
        app: ['./src/javascript/app.jsx']
    },

    output: {
        path: './src/main/webapp/build',
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [
            {
                // CSS files go here (Loading goes right to left)
                test: /\.css$/,
                loader: 'style!' + 'css?sourceMap'
            },
            {
                // SASS files go here
                test: /\.scss$/,
                loader: 'style!' + 'css?sourceMap' + '!sass?sourceMap'
            },
            {
                // JS / JSX files go here
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                // JSON files go here
                test: /\.(json)$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                // Font files go here
                test: /\.(svg|ttf|woff|woff2|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            }
        ]
    },

    plugins: [
        //new LiveReloadPlugin({})
    ],

    devtool: 'source-map'
};