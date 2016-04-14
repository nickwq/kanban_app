const path = require('path');
const webpack = require('webpack');
const merge =  require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const pkg = require('./package.json');

process.env.BABEL_ENV = TARGET;

const common = {
    entry: {
        app: PATHS.app
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: PATHS.app
            }, {
                test: [/\.js$/, /\.jsx$/],
                loaders: ['babel?cacheDirectory'],
                include: PATHS.app
            }
        ]
    }
};

//default config
if(TARGET === 'start' || !TARGET){
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.build,
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'error-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true
            })
        ]
    });
}

if(TARGET === 'build'){
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies).filter(function (v) {
                return v !== 'alt-utils';
            })
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}