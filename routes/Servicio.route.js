//Importo el Router de Express
const {Router} = require('express');
const { check } = require('express-validator');
const { listarServicios, registrarServicio, eliminarServicio, actualizarServicio } = require('../controllers/Servicio.controller');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//OBTINE UNA LISTA DE LOS SERVICIOS
/**
 * @openapi
 * /api/listar/id?: 
 *  get:
 *      tags:
 *        -  Servicio
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
router.get('/listar/:id?',listarServicios);


//REGISTRA UN NUEVO SERVICIO
/**
 * @openapi
 * /api/registrar/id_servicio/fecha_inicio/fecha_fin: 
 *  post:
 *      tags:
 *        -  Servicio
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
router.post('/registrar', [
    check('id_comercio','El nombre id del comercio es obligatorio').isLength({min:5}),
    check('nom_servicio','El nombre del servicio es obligatorios').isLength({min:5}),
    check('hora_apertura','La hora de apertura del servicio es obligatoria minimo 8 y maximo 15').isNumeric({min:8,max:15}),
    check('hora_cierre','La hora de cierre del servicio es obligatoria minimo 8 y maximo 15').isNumeric({min:8,max:15}),
    validarCampos
], registrarServicio);

//ELIMINA UN SERVICIO RECIBE EL ID POR URL
/**
 * @openapi
 * /api/eliminar/id: 
 *  delete:
 *      tags:
 *        -  Servicio
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
router.delete('/eliminar/:id', eliminarServicio);

//ACTUALIZA UN SERVICIO RECIBE EL ID POR URL
/**
 * @openapi
 * /api/actualizar/id: 
 *  put:
 *      tags:
 *        -  Servicio
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
router.put('/actualizar/:id', actualizarServicio );


//EXPORTO EL ROUTER
module.exports = router;