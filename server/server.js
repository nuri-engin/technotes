require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swStats = require('swagger-stats');    
const YAML = require('yamljs');

// Load your swagger specification 
let apiSpec = {};
try {
    apiSpec = YAML.load('./swagger.yaml');
} catch (e) {
    console.log(e);
}
/**
 * Server Startup File
 * 
 * The server.js file is the entry point into the boilerplate Node api, it configures application middleware, binds controllers to routes and 
 * starts the Express web server for the api.
 */
dotenv.config();

const app = express();
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// Enable swagger-stats middleware in express app, passing swagger specification as option 
app.use(swStats.getMiddleware({
    swaggerSpec: JSON.stringify(apiSpec)
}));


// Welcome the visitors...
app.get('/', (req, res) => {
    res.send(`
        <h1> Hello to TechNotes API... </h1> 
        <br />
        Please ensure to request to deployed API!...
        @ <a href="https://technotes-api-main.herokuapp.com/"> https://technotes-api-main.herokuapp.com/ </a>
        <br /> <hr />
        API doc enabled!
        @ <a href="https://technotes-api-main.herokuapp.com/api-docs/"> https://technotes-api-main.herokuapp.com/api-docs/ </a>
    `);
});

// api routes for accounts
app.use('/api/accounts', require('./accounts/accounts.controller'));

// api routes for posts
app.use('/api/posts', require('./posts/posts.controller'));

// api routes for commentapis
app.use('/api/comments', require('./comments/comments.controller'));

// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
