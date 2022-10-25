const { Schema, model } = require("mongoose");

//INSTANCIO EL ESQUEMA PARA EL OBJETO SERVICIOS
const ServicioSchema = Schema({
    id_comercio:{
        type : String,
        required : true
    },
    nom_servicio:{
        type : String,
        required : true
    },
    hora_apertura :{
        type : Number,
        required : true,
        default:8
    },
    hora_cierre :{
        type : Number,
        required : true,
        default:18
    },
    duracion:{
       type : Number,
       required : true,
       default:30     
    }
},
{
    timestamps : true,
    versionKey:false
}
)

//EXPORTO EL ESQUEMA PASANDO COMO PARAMETRO EL NOMBRE QUE QUIERO
// QUE APARESCA EN BD EN ESTE CASO ES Servicio
module.exports = model('Servicio',ServicioSchema);