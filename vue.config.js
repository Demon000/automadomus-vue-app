// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

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
};
