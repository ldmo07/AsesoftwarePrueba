const mongoose = require('mongoose');

//METOD QUE MANEJARA LA CONEXION A LA BD
const dbConnection = async () => {

    try {
        
        //MONGOOSE NOS AYUDARA A MANIPULAR LA BD
       await mongoose.connect(process.env.BD_CNN , {
           useNewUrlParser : true,
           useUnifiedTopology : true,
          // useCreateIndex : true
       });

       console.log("BD ONLINE");

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de incializar la BD')
    }

}

// EXPORTO EL MODULO
module.exports = {
    dbConnection
}