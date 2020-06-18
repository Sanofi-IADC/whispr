module.exports = {
    title: 'whispr',
    description: "whispr docs",
    base: '/whispr/',
    dest: './docs_dist',
    themeConfig: {
        nav: [
            { text: 'Introduction', link: '/' }
        ],
        sidebar: [
            '/',
            '/page-a',
            ['/page-b', 'Explicit link text']
        ]
    }
}