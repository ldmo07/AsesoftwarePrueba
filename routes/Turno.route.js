//Importo el Router de Express
const {Router} = require('express');
const { check } = require('express-validator');
const { listarTurnos, registrarTurno, eliminarTurno, actualizarTurno } = require('../controllers/Turno.controller');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//OBTINE UNA LISTA DE LOS TURNOS
/**
 * @openapi
 * /api/listar/id?: 
 *  get:
 *      tags:
 *        -  Turno
 *      response:
 *          200:
 *              description: OK
 *              content :
 *                  application/json:
 *                  schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type:string
 *                           example:OK
 *                      data:
 *                          type: array
 *                      items:
 *                           type:object
 */
router.get('/listar/:id?',listarTurnos);


//REGISTRA UN NUEVO TURNO
/**
 * @openapi
 * /api/registrar/id_servicio/fecha_inicio/fecha_fin: 
 *  post:
 *      tags:
 *        -  Turno
 *      response:
 *          200:
 *              description: OK
 *              content :
 *                  application/json:
 *                  schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type:string
 *                           example:OK
 *                      data:
 *                          type: array
 *                      items:
 *                           type:object
 */
router.post('/registrar/:id_servicio/:fecha_inicio/:fecha_fin', /*[
    check('id_servicio','El nombre id del servicio es obligatorio').isLength({min:5}),
    check('fecha_turno','La fecha del turno es obligatoria').isDate(),
    check('hora_inicio','La hora de inicio del turno es obligatoria minimo 8 y maximo 15').isNumeric({min:8,max:15}),
    check('hora_fin','La hora fin del turno es obligatoria minimo 8 y maximo 15').isNumeric({min:8,max:15}),
    validarCampos
],*/ registrarTurno);

//ELIMINA UN TURNO RECIBE EL ID POR URL
/**
 * @openapi
 * /api/eliminar/id: 
 *  delete:
 *      tags:
 *        -  Turno
 *      response:
 *          200:
 *              description: OK
 *              content :
 *                  application/json:
 *                  schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type:string
 *                           example:OK
 *                      data:
 *                          type: array
 *                      items:
 *                           type:object
 */
router.delete('/eliminar/:id', eliminarTurno);

/**
 * @openapi
 * /api/actualizar/id: 
 *  put:
 *      tags:
 *        -  Turno
 *      response:
 *          200:
 *              description: OK
 *              content :
 *                  application/json:
 *                  schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type:string
 *                           example:OK
 *                      data:
 *                          type: array
 *                      items:
 *                           type:object
 */
//ACTUALIZA UN TURNO RECIBE EL ID POR URL
router.put('/actualizar/:id', actualizarTurno );


//EXPORTO EL ROUTER
module.exports = router;