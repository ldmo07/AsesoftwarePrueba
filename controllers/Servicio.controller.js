const {response} = require ('express');
const Servicio = require('../models/Servicio');



//METODO QUE SE ENCARGA DE LISTAR LOS SERVICIO EN BD
const listarServicios = async  (req,res=response) =>{
    try {
     
     //CAPTURO EL id DEL QUE ME VENGA COMO PARAMETRO POR URL
     const {id} = req.params;

     let servicios;
   
     if(!id){
        // SI NO ENVIAN EL ID TRAIGO TODOS LOS REGISTROS
        servicios = await Servicio.find({});
     }else{
         //SI ENVIAN EL ID DEVUELVO LOS REGISTRO QUE TENGAN ESE ID
        servicios = await Servicio.find({_id:id});
     }
       return res.status(200).json({
            ok:true,
            data :servicios
        });

    } catch (error) {
       return res.status(500).json({
            ok:false,
            msg : 'Ocurrio un fallo listando los servicios'
        })
    }
}

//METODO QUE SE ENCARGARA DE INSERTAR UN TURNO EN BD
const registrarServicio = async (req,res = response) =>{
    
    //OBTENGO LOS VALORES DEL BODY QUE VENGAN EN EL REQUEST
    const {id_comercio,nom_servicio, hora_apertura,hora_cierre, duracion } = req.body;

    //VALIDACION DE HORAS
    if(hora_apertura>hora_cierre)
        return res.status(404).json({
            ok:false,
            msg : 'La hora de cierre no puede ser menor que la hora de apertura',
        });
    
    try {

        //INSTANCIO UN OBJETO DE TIPO TURNO CON LA DATA QUE VENGA EN EL BODY DEL REQUEST
        const dbServicio = new Servicio(req.body);

        //ESPERO HASTA QUE SE HAGA LA INSERCION EN BD
        await dbServicio.save();

        return res.status(200).json({
            ok:true,
            data:{
                _id:dbServicio.id,
                id_comercio,
                nom_servicio,
                hora_apertura,
                hora_cierre,
                duracion:dbServicio.duracion
            },
            msg : 'Servicio Registrado exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            ok:true,
            msg : 'Error  Registrando el servicio =>'
        })
    }
}

//METODO QUE SE ENCARGARA DE ELIMINAR UN TURNO EN BD
const eliminarServicio = async (req,res = response) =>{
    //OBTENGO EL PARAMETRO QUE ME LLEGUE POR URL
     const id = req.params.id
     try {
      
      //VALIDO QUE EXISTA UN TURNO CON ESE ID
      const existeServicio = await Servicio.findById(id);
 
      if(existeServicio){
         //BUSCA Y ELIMINA UN TURNO FILTRANDOLO POR EL ID
         const servicio = await Servicio.deleteOne({_id:id});
 
         return res.status(200).json({
              ok:true,
              msg : 'Se elimino el servicio correctamente'
         });
      }else{
         return res.status(400).json({
             ok:false,
             msg : 'No se encontro el Servicio a eliminar'
        });
      }
      
      
     } catch (error) {
         return res.status(500).json({
             ok:false,
             msg : 'Fallo intentando eliminar el servicio'
         });
     }
      
}

//METODO QUE SE ENCARGARA DE ACTUALIZAR UN TURNO EN BD
const actualizarServicio =  (req,res = response) =>{
    //OBTENGO EL PARAMETRO QUE ME LLEGUE POR URL
    const id = req.params.id
 
     try {
         //ACTUALIZO UN TURNO SEGUN SU ID PASANDOLE LA DATA QUE VENGA DEL BODY
         const servicio =  Servicio.updateOne( {_id:id} , {$set:req.body} , (err,resultado)=>{
             //VALIDO QUE SI HAY ERRORES AL INTENTAR REALIZAR LA ACTUALIZACION MANDO OBJETO DE ERROR
             //SINO MANDO OBJETO DE EXITO
             if(err){
                 //res.send(err);
                 return res.status(400).json({
                     ok:false,
                     msg : 'No se actualizo el Servicio no se encontro el id',
                     error : err
                 });
             }else{
              
                 return res.status(200).json({
                     ok:true,
                     msg : 'se actualizo el Servicio',
                     data : resultado
                 });
             }     
         }); 
         
     } catch (error) {
         return res.status(500).json({
             ok:false,
             msg : 'Fallo actualizando el servicio'
         });
     }
        
     
 }


//Exporto los metodos
module.exports = {
    listarServicios,
    eliminarServicio,
    registrarServicio,
    actualizarServicio
}