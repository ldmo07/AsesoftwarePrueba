const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//METADATA
const options = {
    definition : {
        openapi:"3.0.0",
        info : {
            title:'Asesoftware API',
            version: '1.0.0'
        }
    },
    apis:["routes/Comercio.route.js","routes/Servicio.route.js","routes/Turno.route.js"]
}

//Documentacion en JSON
const swaggerSpec = swaggerJSDoc(options);

//
const swaggerDocs = (app,port) =>{
    app.use('/api/v1/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
    app.get('/api/v1/docs.json',(req,res) =>{
        res.setHeader('Content-Type','application/json');
        res.send(swaggerSpec);
    });

    console.log(`Version 1 Doc http://localhost:${port}/api/v1/docs`);
}

module.exports = {swaggerDocs}