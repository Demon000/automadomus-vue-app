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
    },
    chainWebpack: config => {
        config.resolve.symlinks(false);
    },
};
