const { response } = require("express");
const { validationResult } = require("express-validator");

//FUNCION MIDDLEWARE QUE VALIDA ERRORES POR CAMPOS FALTANTES
const validarCampos = (req,res = response, next) =>{
        //capturo los errores
        const errores = validationResult(req);

        //Si hay algun error retorno Json con el fallo
        if(!errores.isEmpty()){
            return res.status(400).json({
                ok:false,
                errores : errores.mapped()
            });
        }
    
        //FUNCION QUE INDICA QUE CONTINUE CON EL SGT MIDDLEWARE
        next();
    
}

//Exporto el Middleware
module.exports ={
    validarCampos
}