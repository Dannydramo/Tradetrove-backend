module.exports = {
    components: {
        securitySchemes: {
            Authorization: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        schemas: {
            id: {
                type: 'string',
                description: 'An id of a model',
                example: 'tyVgf',
            },
            UserRegistrationInput: {
                type: 'object',
                properties: {
                    firstName: {
                        type: 'string',
                        description: 'User First name',
                        example: 'John',
                    },
                    lastName: {
                        type: 'string',
                        description: 'User Last name',
                        example: 'Doe',
                    },
                    email: {
                        type: 'string',
                        description: 'User Email address',
                        example: 'johndoe@gmail.com',
                    },
                    password: {
                        type: 'string',
                        description: 'User Password',
                        example: 'Password@1',
                    },
                },
            },
            UserLoginInput: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        description: 'User Email address',
                        example: 'johndoe@gmail.com',
                    },
                    password: {
                        type: 'string',
                        description: 'User Password',
                        example: 'Password@1',
                    },
                },
            },

            Error: {
                type: 'object',
                properties: {
                    responseType: {
                        type: 'string',
                    },
                    message: {
                        type: 'string',
                    },
                    data: {
                        type: 'string',
                    },
                },
            },
        },
    },
};
