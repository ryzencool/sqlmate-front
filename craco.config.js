module.exports = {
    webpack: {
        configure:{
            // See https://github.com/webpack/webpack/issues/6725
            module:{
                rules: [{
                    test: /\.wasm$/,
                    type: 'javascript/auto',
                }]
            },
            resolve: {
                extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],// other stuff
                fallback: {
                    "fs": false,
                    "path": require.resolve("path-browserify"),
                    "crypto": false,
                }
            },
        },

    }


};
