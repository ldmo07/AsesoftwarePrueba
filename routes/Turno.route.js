//Importo el Router de Express
const {Router} = require('express');
const { check } = require('express-validator');
const { listarTurnos, registrarTurno, eliminarTurno, actualizarTurno } = require('../controllers/Turno.controller');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//OBTINE UNA LISTA DE LOS TURNOS
router.get('/listar/:id?',listarTurnos);


//REGISTRA UN NUEVO TURNO
router.post('/registrar/:id_servicio/:fecha_inicio/:fecha_fin', /*[
    check('id_servicio','El nombre id del servicio es obligatorio').isLength({min:5}),
    check('fecha_turno','La fecha del turno es obligatoria').isDate(),
    check('hora_inicio','La hora de inicio del turno es obligatoria minimo 8 y maximo 15').isNumeric({min:8,max:15}),
    check('hora_fin','La hora fin del turno es obligatoria minimo 8 y maximo 15').isNumeric({min:8,max:15}),
    validarCampos
],*/ registrarTurno);

//ELIMINA UN TURNO RECIBE EL ID POR URL
router.delete('/eliminar/:id', eliminarTurno);

//ACTUALIZA UN TURNO RECIBE EL ID POR URL
router.put('/actualizar/:id', actualizarTurno );


//EXPORTO EL ROUTER
module.exports = router;