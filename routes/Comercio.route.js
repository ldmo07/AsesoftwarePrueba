//Importo el Router de Express
const {Router} = require('express');
const { check } = require('express-validator');
const { listarComercios, eliminarComercio, registrarComercio, actualizarComercio } = require('../controllers/Comercio.controller');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//OBTINE UNA LISTA DE LOS COMERCIOS
router.get('/listar/:id?',listarComercios);


//REGISTRA UN NUEVO COMERCIO
router.post('/registrar', [
    check('nom_comercio','El nombre del comercio es obligatorio').isLength({min:2}),
    check('aforo_maximo','El aforo maximo es obligatorio minimo 1 y maximo 100').isNumeric({min:1,max:100}),
    validarCampos
], registrarComercio);

//ELIMINA UN COMERCIO RECIBE EL ID POR URL
router.delete('/eliminar/:id', eliminarComercio);

//ACTUALIZA UN COMERCIO RECIBE EL ID POR URL
router.put('/actualizar/:id', actualizarComercio );


//EXPORTO EL ROUTER
module.exports = router;