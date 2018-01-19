import expressSwaggerGenerator from './express-swagger-generator';

export const setupSwagger = (app, host, basePath) => {
  const options = {
    swaggerDefinition: {
      info: {
        description: 'This is a sample server',
        title: 'Swagger',
        version: '1.0.0',
      },
      host,
      basePath,
      produces: [
        'application/json',
        'application/xml'
      ],
      schemes: ['http', 'https']
    },
    basedir: __dirname, // app absolute path
    files: ['../api/controllers/**/*.js'] // Path to the API handle folder
  };

  const expressSwagger = expressSwaggerGenerator(app);
  expressSwagger(options);
};
