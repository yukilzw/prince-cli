import path = require('path');
import webpack = require('webpack');
import { REMOTE, LOCAL } from './config';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const root = path.join(__dirname, '../../../');

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
} else {
    extraPlugins.push(new BundleAnalyzerPlugin());
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
        entry: path.join(process.cwd(), './src/entry.tsx')
    },
    output: {
        path: path.join(process.cwd(), './dist'),
        publicPath,
        filename: isDebug ? '[name].js' : '[name]_[chunkhash:5].js',
        chunkFilename: isDebug ? '[name].js' : '[name]_[chunkhash:5].js'
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                exclude: /node_modules/,
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
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [path.resolve(root, 'node_modules', '@babel/preset-env'), { modules: false }],
                        path.resolve(root, 'node_modules', '@babel/preset-react')
                    ],
                    plugins: [
                        [path.resolve(root, 'node_modules', '@babel/plugin-proposal-decorators'), { 'legacy': true }],
                        path.resolve(root, 'node_modules', '@babel/plugin-proposal-class-properties'),
                        path.resolve(root, 'node_modules', '@babel/plugin-syntax-dynamic-import'),
                        path.resolve(root, 'node_modules', '@babel/plugin-transform-object-assign'),
                        [path.resolve(root, 'node_modules', '@babel/plugin-transform-runtime'), { 'corejs': 2 }]
                    ]
                }
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(process.cwd(), './tsconfig.json')
                        }
                    }
                ],
                exclude: /node_modules/
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
    resolveLoader: {
        modules: [
            path.resolve(root, 'node_modules')
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(root, 'node_modules')
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@common': path.join(process.cwd(), './src/common'),
            '@route': path.join(__dirname, '../routeImage')
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
            template: path.join(process.cwd(), './temp.html'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                minifyJS: true
            },
            favicon: path.join(process.cwd(), './src/common/assests/prince.ico')
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