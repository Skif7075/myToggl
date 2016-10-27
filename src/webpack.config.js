var path = require('path');
 module.exports = [
  {
        entry: path.resolve(__dirname,'public','scripts', 'client.js'),
        output: {
            path: path.resolve(__dirname,'public','scripts'),
            filename: 'bundle.js'
        },
        resolve: {
            root: [
                path.join(__dirname,'public','styles'),
                path.join(__dirname,'public','scripts'),
                path.join(__dirname,'node_modules'),
            ],
        },
        module: {
            loaders: [{
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query:
                {
                    presets:['es2015', 'react']
                },
            }]
        }
    },
/*
    {
        entry: path.resolve(__dirname,'server.js'),
        output: {
            path: path.resolve(__dirname),
            filename: 'server-bundle.js'
        },        resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        root: [
                path.join(__dirname)
            ],
        },
        target: "node",
        loaders: [{
            test: /\.json$/,
            loader: 'json',
        }],
        node: {
            net: 'empty',
            tls: 'empty',
            dns: 'empty',
            fs: 'empty',
        },

    }*/
];