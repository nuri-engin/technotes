const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const router = express.Router();

const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Swagger API Docs Route Handler (/api-docs)
 * 
 * The Swagger docs route handler uses the Swagger UI Express module to serve auto-generated Swagger UI documentation based on the swagger.yaml file 
 * from the /api-docs path of the api. The route handler is bound to the /api-docs path in the main server.js file.
 * 
 * For more info on swagger-ui-express see https://www.npmjs.com/package/swagger-ui-express.
 */
module.exports = router;