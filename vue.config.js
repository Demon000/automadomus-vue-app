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
    chainWebpack: config => {
        config.optimization.delete('splitChunks');
    },
};
