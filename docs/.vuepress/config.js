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
            '/security.html',
            {
                title: 'Api',
                collapsable: false,
                children: [
                    '/api/introduction',
                    '/api/graphql',
                    '/api/rest',
                ]
            },
            '/filters/',
            '/testing.html',
            '/events/',
            '/webhooks/',
            '/plugins/',
            '/fileupload.html',
            '/indexing.html',
            '/apm.html',
        ]
    }
}
