module.exports = {
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'],
                description: "Register User",
                summary: "Register User",
                operationId: "registerUser",
                parameters:[],
                requestBody: {
                    content:{
                        'application/json': {
                            schema:{
                                $ref:'#/components/schemas/UserRegistrationInput'
                            }
                        }
                    }
                },
                responses:{
                    '200': {
                        description: "User registered successfully"
                    },
                    '500': {
                        description: 'Internal server error'
                    }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                description: "Sign in User",
                summary: "Sign in User",
                operationId: "loginUser",
                parameters:[],
                requestBody: {
                    content:{
                        'application/json': {
                            schema:{
                                $ref:'#/components/schemas/UserLoginInput'
                            }
                        }
                    }
                },
                responses:{
                    '200': {
                        description: "Login successful"
                    },
                    '500': {
                        description: 'Unable to process sign in'
                    }
                }
            },
        },
        // '/auth/request-access-token': {
        //     post: {
        //         tags: ['Auth'],
        //         description: "Request new Access Token",
        //         summary: "Request new Access Token",
        //         operationId: "refreshToken",
        //         parameters:[],
        //         requestBody: {
        //             content:{
        //                 'application/json': {
        //                     schema:{
        //                         type: 'object',
        //                         properties:{
        //                             refreshToken: {
        //                                 type: 'string',
        //                                 description: "User Account Refresh token",
        //                                 example: "7454374d-333f-4e5a-8200-aa5f9bb3597a",
        //                             },
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         responses:{
        //             '200': {
        //                 description: "New access token generated"
        //             },
        //             '400': {
        //                 description: 'Refresh token was expired. Please make a new sign in request'
        //             },
        //             '404': {
        //                 description: 'Invalid refresh token'
        //             },
        //             '500': {
        //                 description: 'Unable to process sign in'
        //             }
        //         }
        //     }
        // },
        // '/auth/logout': {
        //     get: {
        //         tags: ['Auth'],
        //         description: "Logout a User",
        //         summary: "Logout a User",
        //         operationId: "logout",
        //         parameters:[],
        //         responses:{
        //             '200': {
        //                 description: "Logged out successfully"
        //             },
        //             '500': {
        //                 description: 'Internal server error'
        //             }
        //         }
        //     },
        // },
    }
}