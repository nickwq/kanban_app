const path = require('path');
const webpack = require('webpack');
const merge =  require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(__dirname, 'app/main.css'),
    test: path.join(__dirname, 'tests')
};

const pkg = require('./package.json');

process.env.BABEL_ENV = TARGET;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style
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
                test: [/\.js$/, /\.jsx$/],
                loaders: ['babel?cacheDirectory'],
                include: PATHS.app
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'Kanban app',
            appMountId:'app',
            inject: false
        })
    ]
};

//default config
if(TARGET === 'start' || !TARGET){
    module.exports = merge(common, {
        entry: {
            style: PATHS.style
        },
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'error-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        module: {
            loaders: [
                // Define development specific CSS setup
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: PATHS.app
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true
            })
        ]
    });
}

if(TARGET === 'build' || TARGET=== 'stats'){
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies).filter(function (v) {
                return v !== 'alt-utils';
            }),
            style: PATHS.style
        },
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    include: PATHS.app
                }
            ]
        },
        plugins: [
            new CleanPlugin([PATHS.build], {
                verbose: false // Don't write logs to console
            }),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
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

if(TARGET === 'test' || TARGET === 'tdd') {
    module.exports = merge(common, {
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                'app': PATHS.app
            }
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['isparta-instrumenter'],
                    include: PATHS.app
                }
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel?cacheDirectory'],
                    include: PATHS.test
                }
            ]
        }
    })
}