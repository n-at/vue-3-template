const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

//Variables////////////////////////////////////////////////////////////////////

const developmentBuildPath = path.resolve(__dirname, 'public', 'build')
const productionBuildPath = path.resolve(__dirname, 'public', 'build')

const entries = {
    index: './public/index.js',
}

///////////////////////////////////////////////////////////////////////////////

module.exports = (env, argv) => {
    let outputPath;
    let optimization;

    if (argv.mode === 'production') {
        outputPath = productionBuildPath;
        optimization = {
            minimize: true,
            minimizer: ['...', new CssMinimizerPlugin()],
        };
    } else {
        outputPath = developmentBuildPath;
        optimization = {};
    }

    ///////////////////////////////////////////////////////////////////////////

    //Configuring ESLint: https://eslint.org/docs/user-guide/configuring/
    const eslintConfiguration = {
        "env": {
            "browser": true,
            "es2020": true,
        },
        "parserOptions": {
            "ecmaVersion": 2020,
            "sourceType": "module",
        },
        "extends": "eslint:recommended",
        "rules": {},
    };

    //babel-preset-env configuration: https://babeljs.io/docs/en/babel-preset-env
    const babelPresetConfiguration = {
        "targets": "> 0.25%, not dead",
        "useBuiltIns": "entry",
        "corejs": "3.15",
    };

    //postcss options: https://webpack.js.org/loaders/postcss-loader/
    const postcssConfiguration = {
        plugins: [
            ["postcss-preset-env"],
        ],
    };

    ///////////////////////////////////////////////////////////////////////////

    const vueRule = {
        test: /\.vue$/,
        use: 'vue-loader',
    };
    const jsRule = {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    ['@babel/preset-env', babelPresetConfiguration],
                ],
            },
        },
    };
    const cssRule = {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: postcssConfiguration,
                },
            },
        ],
    };

    ///////////////////////////////////////////////////////////////////////////

    return {
        mode: argv.mode === 'production' ? 'production' : 'development',

        entry: entries,

        output: {
            filename: '[name].js',
            path: outputPath,
        },

        plugins: [
            new webpack.ProgressPlugin(),
            new CleanWebpackPlugin(),
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin(),
            new ESLintWebpackPlugin({overrideConfig: eslintConfiguration}),
        ],

        module: {
            rules: [
                vueRule,
                jsRule,
                cssRule,
            ],
        },

        devtool: 'source-map',
        optimization: optimization,
        performance: { hints: false },
        resolve: {},
    };
};
