const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  //ts -> js 로 바꿔 인식
    entry: {    //시작하는 부분
        index: './src/index.ts',
        addUser: './src/addUser.ts',
        'check/readList': './src/check/readList.ts',
        'check/index': './src/check/index.ts',
        'check/addUser': './src/check/addUser.ts',
        'check/delUser': './src/check/delUser.ts',
        code: './src/code.ts',
        nav: './src/nav.ts',
        login: './src/login.ts',
        visit: './src/visit.ts',
        scan: './src/scan.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }, {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader'
            }
        ],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {   //결과
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/addUser.html',
            filename: './addUser.html',
            chunks: ['addUser']
        }),
        new HtmlWebpackPlugin({
            template: './src/check/readList.html',
            filename: './check/readList.html',
            chunks: ['check/readList']
        }),
        new HtmlWebpackPlugin({
            template: './src/check/index.html',
            filename: './check/index.html',
            chunks: ['check/index']
        }),
        new HtmlWebpackPlugin({
            template: './src/check/addUser.html',
            filename: './check/addUser.html',
            chunks: ['check/addUser']
        }),
        new HtmlWebpackPlugin({
            template: './src/check/delUser.html',
            filename: './check/delUser.html',
            chunks: ['check/delUser']
        }),
        new HtmlWebpackPlugin({
            template: './src/code.html',
            filename: './code.html',
            chunks: ['code']
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: './login.html',
            chunks: ['login']
        }),
        new HtmlWebpackPlugin({
            template: './src/visit.html',
            filename: './visit.html',
            chunks: ['visit']
        }),
        new HtmlWebpackPlugin({
            template: './src/scan.html',
            filename: './scan.html',
            chunks: ['scan']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            chunks: ['index']
        }),
    ],
    // devServer:{
    //     contentBase:`${__dirname}/dist`,
    //     inline:true,
    //     hot:true,
    //     proxy: {
    //         '/api': {
    //             target: 'http://127.0.0.1:4000',
    //             changeOrigin: true,
    //             secure: false
    //         },
    //         '/socket.io' : {
    //             target: 'http://127.0.0.1:4000',
    //             ws: true,
    //             changeOrigin: true,
    //             secure: false
    //         }
    //     },
    //     host: '127.0.0.1',
    //     port: 4500
    // },
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },
};