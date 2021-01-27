const path = require('path');

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname, './src/main.ts')],
    mode: 'production',
    devtool: 'source-map',
    target: 'es5',
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],

    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};