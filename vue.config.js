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
