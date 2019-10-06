const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

class swaggerWeb {

    constructor(express, bodyParser, config) {
        this.express = express;
        this.config = config;
        this.bodyParser = bodyParser;
    }

    start() {
        const app = this.express();
        app.set('port', this.config.port);
        app.use(this.bodyParser.json());
        app.use(this.bodyParser.urlencoded({extended: true}));
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', this.config.allow_origin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        this.serverRoot(app);
        this.serverGetDocs(app);
        app.listen(app.get('port'), function () {
            console.log('swagger running on port', app.get('port'))
        });
    }

    serverGetDocs(app) {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'News API',
                    version: '1.0.0',
                    description: 'News backend'
                },
                host: this.config.host,
                schemes: this.config.schemes,
                basePath: this.config.basePath,
                securityDefinitions: {
                    TOKEN: {
                        type: 'apiKey',
                        description: 'TOKEN authorization of an API',
                        name: 'Authorization',
                        in: 'header',
                    },
                },
            },
            apis: this.config.files
        }
        app.use(this.config.url, swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
    }


    serverRoot(app) {
        /**
         * @swagger
         * /:
         *    get:
         *      description: Healtcheck
         *      responses:
         *       200:
         *         description: "{data: 'hello backend world'}"
         */
        app.get('/swagger/', (req, res) => {
            res.send({data: 'hello swagger world ->' + this.config.url});
        });
    }
}

module.exports = swaggerWeb;
