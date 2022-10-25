//IMPORTO EXPRESS
const express = require('express');
//IMPORTO EL CORS
const cors = require('cors');
const { dbConnection } = require('./db/config');
//IMPORTO CONFIGURACION DE ENV
require('dotenv').config();
//IMPORTO SWAGGER
const {swaggerDocs:V1SwaggerDocs} = require('./swager');

//CREO EL SERVIDOR DE APLICACION DE EXPRESS
const app = express();

//INVOCO LA CONEXION A LA BD
 dbConnection();



//DEFINIMOS EL CORS
app.use( cors() );


//LECTURA Y PARSEO DEL BODY
app.use( express.json() );


//Configuro Rutas y Middleware del modulo de Comercio
app.use('/api/comercio' , require('./routes/Comercio.route') );

//Configuro Rutas y Middleware del modulo de Servicio
app.use('/api/servicio' , require('./routes/Servicio.route') );

//Configuro Rutas y Middleware del modulo de Turno
app.use('/api/turno' , require('./routes/Turno.route') );


//PONGO A ESCUCHAR POR EL PUERTO DEFINIDO EN LOS .ENV
app.listen(/*4001*/process.env.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    V1SwaggerDocs(app,process.env.PORT);//LLAMO A SWAGER
});