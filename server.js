require("node-env-file")(__dirname + '/.env');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config.dev");

var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    contentBase: '/build',
    hot: process.env.NODE_ENV == 'development',
    inline: true,
    info: false,
    stats: {colors: true},
    compress: true,
    historyApiFallback: true
}).listen(process.env.NODE_PORT, process.env.NODE_HOST, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("WebpackDevServer listen: http://" + process.env.NODE_HOST + ":" + process.env.NODE_PORT);
});