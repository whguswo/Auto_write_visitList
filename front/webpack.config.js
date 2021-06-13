const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  //ts -> js 로 바꿔 인식
    entry: {    //시작하는 부분
        // index: './src/index.ts',
        addUser: './src/addUser.ts',
        admin: './src/admin.ts',
        code: './src/code.ts'
    },
    devtool: 'inline-source-map',
    mode:'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test:/\.css$/,
                use: ["style-loader", "css-loader"]
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
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename:'./index.html',
            chunks:['src/nav.ts', 'src/nav.css']
        }),
        new HtmlWebpackPlugin({
            template: './src/addUser.html',
            filename:'./addUser.html',
            chunks:['addUser', 'src/nav.css']
        }),
        new HtmlWebpackPlugin({
            template: './src/admin.html',
            filename:'./admin.html',
            chunks:['src/admin.ts', 'src/nav.ts', 'src/nav.css']
        }),
        new HtmlWebpackPlugin({
            template: './src/code.html',
            filename:'./code.html',
            chunks:['src/code.ts', 'src/nav.ts', 'src/nav.css']
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename:'./login.html',
            chunks:['src/login.ts', 'src/nav.ts', 'src/nav.css']
        }),
    ],
    devServer:{
        contentBase:`${__dirname}/dist`,
        inline:true,
        hot:true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4000',
                changeOrigin: true,
                secure: false
            },
            '/socket.io' : {
                target: 'http://127.0.0.1:4000',
                ws: true,
                changeOrigin: true,
                secure: false
            }
        },
        host: '127.0.0.1',
        port: 4500
    },
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },
};