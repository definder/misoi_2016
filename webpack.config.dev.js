require("node-env-file")(__dirname + '/.env');
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

var listening = "http://" + process.env.NODE_HOST + ":" + process.env.NODE_PORT;

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        ('webpack-dev-server/client?' + listening),
        'webpack/hot/only-dev-server',
        'whatwg-fetch',
        './src/sass/index.scss',
        './src/app/index',
    ],
    output: {
        path: path.join(__dirname),
        filename: 'bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            template: path.join(__dirname, 'src', 'html', 'index.html')
        }),
        new ExtractTextPlugin('style.css'),
        new webpack.NoErrorsPlugin(),
        new CopyWebpackPlugin([
                {
                    context: path.join(__dirname, 'src', 'assets', 'img'),
                    from: '**/*',
                    to: path.join(__dirname, 'assets', 'img')
                }
            ], {copyUnmodified: false}
        ),
    ],
    module: {
        loaders: [
            {
                test: /\.js?/,
                exclude: /node_modules/,
                loaders: ['babel']
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style?sourceMap',
                    'css?sourceMap',
                    'resolve-url',
                    'sass'
                ]
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract(
                    'style!' +
                    'css'
                )
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file?limit=10000&name=[name].[ext]?[hash]"
            }
        ],
    }
};