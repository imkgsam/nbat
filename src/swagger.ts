
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger with TypeScript'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: ''
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
            apiKey : {
              type: 'apiKey',
              name: 'x-api-key',
              in: 'header',
          },
        }
    }
};

const outputFile = '../swagger_output.json';
const routes = ['./src/app.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);