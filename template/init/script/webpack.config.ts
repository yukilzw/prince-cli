import path from 'path';
import webpack from 'webpack';
import { REMOTE, LOCAL } from './config';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

interface WebPackConfig {
    [key: string]: any
}

const extraPlugins = [];

let isDebug = false;

if (process.env.DEBUG === '1') {
    extraPlugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    );
    isDebug = true;
}

let devtool = {};

if (isDebug) {
    extraPlugins.push(new FriendlyErrorsWebpackPlugin());
    devtool = { devtool: 'cheap-module-eval-source-map' };
}

let publicPath;

if (process.env.NODE_ENV === 'production') {
    publicPath = REMOTE.publicPath;
    if (isDebug) {
        publicPath = LOCAL.publicPath;
    }
}

const webpackConfig: WebPackConfig = {
    entry: {
        entry: path.join(__dirname, '../entry.js')
    },
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath,
        filename: isDebug ? '[name].js' : '[name]_[chunkhash:5].js',
        chunkFilename: isDebug ? '[name].js' : '[name]_[chunkhash:5].js'
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    /* !isDebug ? MiniCssExtractPlugin.loader : */'style-loader',
                    `css-loader?minimize=${!isDebug}`,
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')({
                                    browsers: ['last 5 versions']
                                })
                            ]
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: [path.join(__dirname, '../node_modules/')],
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { modules: false }],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                        '@babel/proposal-class-properties',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-object-assign',
                        ['@babel/plugin-transform-runtime', { 'corejs': 2 }]
                    ]
                }
            },
            {
                test: /\.(png|jpeg|jpg)$/,
                loader: 'file-loader?name=img/[name]-[hash].[ext]'
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'bundle',
                    priority: 10
                }
            }
        }
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@common': path.join(__dirname, '../src/common'),
            '@route': path.join(__dirname, './routeImage')
        }
    },
    ...devtool,
    stats: 'minimal',
    plugins: [
        new webpack.DefinePlugin({
            MOCK_PATH: `"${LOCAL.api}"`,
            DEBUG: process.env.DEBUG,
            REQUEST_HOST: process.env.NODE_ENV === 'production' ? `"${REMOTE.api}"` : `"${LOCAL.api}"`,
            SOCKET_HOST: process.env.NODE_ENV === 'production' ? `"${REMOTE.socket}"` : `"${LOCAL.socket}"`
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../temp.html'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                minifyJS: true
            },
            favicon: path.join(__dirname, '../src/common/assests/prince.ico')
        }),
        new MiniCssExtractPlugin({
            filename: '[name]_[chunkhash:5].css'
        }),
        ...extraPlugins
    ],
    mode: isDebug ? 'development' : 'production'
};

export {
    webpackConfig,
    isDebug
};