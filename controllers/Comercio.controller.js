const {response} = require ('express');
const Comercio = require('../models/Comercio');



//METODO QUE SE ENCARGA DE LISTAR LOS COMERCIOS EN BD
const listarComercios = async  (req,res=response) =>{
    try {
     
     //CAPTURO EL id DEL QUE ME VENGA COMO PARAMETRO POR URL
     const {id} = req.params;

     let comercios;
   
     if(!id){
        // SI NO ENVIAN EL ID TRAIGO TODOS LOS REGISTROS
        comercios = await Comercio.find({});
     }else{
         //SI ENVIAN EL ID DEVUELVO LOS REGISTRO QUE TENGAN ESE ID
        comercios = await Comercio.find({_id:id});
     }
       return res.status(200).json({
            ok:true,
            data :comercios
        });

    } catch (error) {
       return res.status(500).json({
            ok:false,
            msg : 'Ocurrio un fallo listando los comercios'
        })
    }
}

//METODO QUE SE ENCARGARA DE INSERTAR UN COMERCIO EN BD
const registrarComercio = async (req,res = response) =>{
    
    //OBTENGO LOS VALORES DEL BODY QUE VENGAN EN EL REQUEST
    const {nom_comercio, aforo_maximo } = req.body;
    
    try {

        //INSTANCIO UN OBJETO DE TIPO COMERCIO CON LA DATA QUE VENGA EN EL BODY DEL REQUEST
        const dbComercio = new Comercio(req.body);

        //ESPERO HASTA QUE SE HAGA LA INSERCION EN BD
        await dbComercio.save();

        return res.status(200).json({
            ok:true,
            data:{
                _id:dbComercio.id,
                nom_comercio,
                aforo_maximo
            },
            msg : 'Comercio Registrado exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            ok:true,
            msg : 'Error  Registrando el comercio =>'
        })
    }
}

//METODO QUE SE ENCARGARA DE ELIMINAR UN COMERCIO EN BD
const eliminarComercio = async (req,res = response) =>{
    //OBTENGO EL PARAMETRO QUE ME LLEGUE POR URL
     const id = req.params.id
     try {
      
      //VALIDO QUE EXISTA UN COMERCIO CON ESE ID
      const existeComercio = await Comercio.findById({_id:id});
 
      if(existeComercio){
         //BUSCA Y ELIMINA UN COMERCIO FILTRANDOLO POR EL ID
         const comercio = await Comercio.deleteOne({_id:id});
 
         return res.status(200).json({
              ok:true,
              msg : 'Se elimino el comercio correctamente'
         });
      }else{
         return res.status(400).json({
             ok:false,
             msg : 'No se encontro el Comercio a eliminar'
        });
      }
      
      
     } catch (error) {
         return res.status(500).json({
             ok:false,
             msg : 'Fallo intentando eliminar el comercio'
         });
     }
      
}

//METODO QUE SE ENCARGARA DE ACTUALIZAR UN COMERCIO EN BD
const actualizarComercio =  (req,res = response) =>{
    //OBTENGO EL PARAMETRO QUE ME LLEGUE POR URL
    const id = req.params.id
 
     try {
         //ACTUALIZO UN COMERCIO SEGUN SU ID PASANDOLE LA DATA QUE VENGA DEL BODY
         const comercio =  Comercio.updateOne( {_id:id} , {$set:req.body} , (err,resultado)=>{
             //VALIDO QUE SI HAY ERRORES AL INTENTAR REALIZAR LA ACTUALIZACION MANDO OBJETO DE ERROR
             //SINO MANDO OBJETO DE EXITO
             if(err){
                 //res.send(err);
                 return res.status(400).json({
                     ok:false,
                     msg : 'No se actualizo el Comercio no se encontro el id',
                     error : err
                 });
             }else{
              
                 return res.status(200).json({
                     ok:true,
                     msg : 'se actualizo el Comercio',
                     data : resultado
                 });
             }     
         }); 
         
     } catch (error) {
         return res.status(500).json({
             ok:false,
             msg : 'Fallo actualizando el comercio'
         });
     }
        
     
 }


//Exporto los metodos
module.exports = {
    listarComercios,
    eliminarComercio,
    registrarComercio,
    actualizarComercio
}