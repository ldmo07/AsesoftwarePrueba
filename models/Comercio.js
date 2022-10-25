const { Schema, model } = require("mongoose");

//INSTANCIO EL ESQUEMA PARA EL OBJETO COMERCIO
const ComercioSchema = Schema({
    nom_comercio:{
        type : String,
        required : true
    },
    aforo_maximo:{
       type : Number,
       required : true     
    }
},
{
    timestamps : true,
    versionKey:false
}
)

//EXPORTO EL ESQUEMA PASANDO COMO PARAMETRO EL NOMBRE QUE QUIERO
// QUE APARESCA EN BD EN ESTE CASO ES Comercio
module.exports = model('Comercio',ComercioSchema);