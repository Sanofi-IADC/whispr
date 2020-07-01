module.exports = {
    title: 'whispr',
    description: "whispr docs",
    base: '/whispr/',
    dest: './docs_dist',
    themeConfig: {
        nav: [
            { text: 'Docs home', link: '/' },
            { text: 'GitHub', link: 'https://github.com/Sanofi-IADC/whispr' },
        ],
        sidebar: [
            '/introduction/',
            '/architecture/',
            '/installation.html',
            '/graphql/',
            '/rest/',
            '/filters/',
            '/testing.html',
            '/events/',
            '/fileupload.html']
    }
}
