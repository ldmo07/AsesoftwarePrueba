const { Schema, model } = require("mongoose");

//INSTANCIO EL ESQUEMA PARA EL OBJETO TURNO
const TurnoSchema = Schema({
    id_servicio:{
        type : String,
        required : true
    },
    fecha_turno:{
        type : Date,
        required : true
    },
    hora_inicio :{
        type : Number,
        required : true,
        //default:8
    },
    hora_fin :{
        type : Number,
        required : true,
        //default:18
    },
    estado:{
       type : Number,
       required : true,
       default:0     
    }
},
{
    timestamps : true,
    versionKey:false
}
)

//EXPORTO EL ESQUEMA PASANDO COMO PARAMETRO EL NOMBRE QUE QUIERO
// QUE APARESCA EN BD EN ESTE CASO ES TURNO
module.exports = model('Turno',TurnoSchema);