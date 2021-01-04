// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'src/index.html',
            filename: 'index.html',
        },
    },
    devServer: {
        https: true,
        cert: fs.readFileSync('../odomu-certs/cert.pem'),
        key: fs.readFileSync('../odomu-certs/key.pem'),
    },
    chainWebpack: config => {
        config.resolve.symlinks(false);
    },
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             sassOptions: {
    //                 includePaths: [
    //                     path.resolve(__dirname, 'node_modules'),
    //                 ],
    //             },
    //         },
    //     },
    // },
};
