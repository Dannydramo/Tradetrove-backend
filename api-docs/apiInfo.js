module.exports = {
    openapi: '3.0.3',
    info: {
        version: '1.0.0',
        title: 'Tradetrove',
        description: 'Tradetrove API playground',
    },
    servers: [
        {
            url: 'http://localhost:5000/api/v1',
            description: 'API server',
        },
    ],
    tags: [
        {
            name: 'Auth',
        },
    ],
};
