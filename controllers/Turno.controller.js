const {response} = require ('express');
const Turno = require('../models/Turno');
const Servicio = require('../models/Servicio');
const moment = require('moment');  

//EXPRESION REGULAR PARA VALIDAR LA FECHA EN FORMATO
const expresionRegularFecha = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/

//METODO QUE SE ENCARGA DE LISTAR LOS TURNOS EN BD
const listarTurnos = async  (req,res=response) =>{
    try {
     
     //CAPTURO EL id DEL QUE ME VENGA COMO PARAMETRO POR URL
     const {id} = req.params;

     let turnos;
   
     if(!id){
        // SI NO ENVIAN EL ID TRAIGO TODOS LOS REGISTROS
        turnos = await Turno.find({});
     }else{
         //SI ENVIAN EL ID DEVUELVO LOS REGISTRO QUE TENGAN ESE ID
        turnos = await Turno.find({_id:id});
     }
       return res.status(200).json({
            ok:true,
            data :turnos
        });

    } catch (error) {
       return res.status(500).json({
            ok:false,
            msg : 'Ocurrio un fallo listando los turnos'
        })
    }
}

//METODO QUE SE ENCARGARA DE INSERTAR UN TURNO EN BD
const registrarTurno = async (req,res = response) =>{
    

    //OBTENGO LOS PARAMETROS QUE VENGAN POR LA REQUEST
    const id_servicio = req.params.id_servicio;
    let fecha_inicio = req.params.fecha_inicio;
    let fecha_fin = req.params.fecha_fin;

    //HAGO LA VALIDACION DE LAS FECHAS EN EL FORMATO DD-MM-YYYY
    const isValidFecha1 = expresionRegularFecha.test(fecha_inicio);
    const isValidFecha2 = expresionRegularFecha.test(fecha_fin);
   
    if(!isValidFecha1 || !isValidFecha2){
        return res.status(404).json({
            ok:false,
            msg : 'Alguna de las fecha no tiene un formato valido (dd-mm-yyyy)'
        })
    }

    //CALCULO LOS DIAS DE DIFERENCIA
    const dias = calcularDias(fecha_inicio,fecha_fin);

    //VARIABLES QUE IRAN CAMBIANDO A LO LARGO DEL FLUJO DE EJECUCION
    let dbServicio; //ALMACENARA UN OBJETO DE TIPO SERVICIO
    let hora_apertura; //ALMACENARA LA HORA DE APERTURA
    let hora_cierre; // ALMACENARA LA HORA DE CIERRE
    let duracion; // ALMACENARA LA DURACION DEL SERVICIO
    let nturnos; // ALMACENARA EL NUMERO DE TURNOS SEGUN LA DURACION Y LA HORAS HORAS DE APERTURA Y CIERRE
   
    //await Turno.deleteMany(); //LIMPIO EL DOCUMENTO DE TURNOS

    //CAPTURO LAS VARIABLES DEL SERVICIO QUE NECESITO
    try{
        dbServicio = await Servicio.findOne({_id:id_servicio});
        hora_apertura = dbServicio.hora_apertura;
        hora_cierre = dbServicio.hora_cierre;
        duracion = dbServicio.duracion;

        //CALCULO EL NUMERO DE TURNOS
        nturnos = calcularTurnosPorDia(hora_apertura,hora_cierre,duracion);

    }catch(error){
        return res.status(500).json({
            ok:true,
            msg : 'Error  obteniendo servicio para el turno'
        })
    }
    
    

    //POR CADA DIA VOY INSERTANDO EL NUMERO DE TURNOS  POR SERVICIO
    for (var i = 0; i < dias; i++) {
        
        for (var j = 0; j < nturnos; j++) {
           
            //VALIDO SI EXISTEN DATOS EN LA TABLA DE TURNOS
            const existeTurno = await Turno.find().count();
            if(existeTurno===0){

                const dbTurno = new Turno();
                dbTurno.id_servicio = id_servicio;
                dbTurno.fecha_turno = fecha_inicio;
                dbTurno.hora_inicio= hora_apertura;
                dbTurno.hora_fin = hora_apertura+(duracion/60);

                //ESPERO HASTA QUE SE HAGA LA INSERCION EN BD
                await dbTurno.save();
               
            }else{
                
                //OBTENGO EL ULTIMO TURNO REGISTRADO
                ultimoTurno = await Turno.findOne().sort({$natural:-1}).limit(1);
                
                const dbTurno = new Turno();
                dbTurno.id_servicio = id_servicio;
                dbTurno.fecha_turno = fecha_inicio;
                dbTurno.hora_inicio = ultimoTurno.hora_fin;
                dbTurno.hora_fin = ultimoTurno.hora_fin+(duracion/60);

                //ESPERO HASTA QUE SE HAGA LA INSERCION EN BD
                await dbTurno.save();
            }
        }

        //VOY SUMANDO DIAS A LA FECHA DE INICIO
        fecha_inicio = sumarDias(fecha_inicio,1);
    }

    
    
    // SI NO ENVIAN EL ID TRAIGO TODOS LOS REGISTROS
    const lstTurnos = await Turno.find({});
    //await Turno.deleteMany(); //LIMPIO EL DOCUMENTO DE TURNOS

    return res.status(200).json({
        nturnos,
        dias,
        fecha_inicio,
        fecha_fin,
        hora_apertura,
        data : lstTurnos
        //ultimoTurno
    });
}

//FUNCION QUE SE ENCARGARA DE ELIMINAR UN TURNO EN BD
const eliminarTurno = async (req,res = response) =>{
    //OBTENGO EL PARAMETRO QUE ME LLEGUE POR URL
     const id = req.params.id
     try {
      
      //VALIDO QUE EXISTA UN TURNO CON ESE ID
      const existeTurno = await Turno.findById(id);
 
      if(existeTurno){
         //BUSCA Y ELIMINA UN TURNO FILTRANDOLO POR EL ID
         const turno = await Turno.deleteOne({_id:id});
 
         return res.status(200).json({
              ok:true,
              msg : 'Se elimino el turno correctamente'
         });
      }else{
         return res.status(400).json({
             ok:false,
             msg : 'No se encontro el Turno a eliminar'
        });
      }
      
      
     } catch (error) {
         return res.status(500).json({
             ok:false,
             msg : 'Fallo intentando eliminar el turno'
         });
     }
      
}

//FUNCION QUE SE ENCARGARA DE ACTUALIZAR UN TURNO EN BD
const actualizarTurno =  (req,res = response) =>{
    //OBTENGO EL PARAMETRO QUE ME LLEGUE POR URL
    const id = req.params.id
 
     try {
         //ACTUALIZO UN TURNO SEGUN SU ID PASANDOLE LA DATA QUE VENGA DEL BODY
         const turno =  Turno.updateOne( {_id:id} , {$set:req.body} , (err,resultado)=>{
             //VALIDO QUE SI HAY ERRORES AL INTENTAR REALIZAR LA ACTUALIZACION MANDO OBJETO DE ERROR
             //SINO MANDO OBJETO DE EXITO
             if(err){
                 //res.send(err);
                 return res.status(400).json({
                     ok:false,
                     msg : 'No se actualizo el Turno no se encontro el id',
                     error : err
                 });
             }else{
              
                 return res.status(200).json({
                     ok:true,
                     msg : 'se actualizo el Turno',
                     data : resultado
                 });
             }     
         }); 
         
     } catch (error) {
         return res.status(500).json({
             ok:false,
             msg : 'Fallo actualizando el turno'
         });
     }   
 }

 //SACA LA DIFERENCIA EN DIAS DE 2 FECHAS
 const calcularDias = (fecha1,fecha2) =>{
   
   /*let fechaInicio = new Date(fecha1).getTime();
   let fechaFin    = new Date(fecha2).getTime();
   let diff = (fechaFin - fechaInicio)/(1000*60*60*24);
   console.log(fechaInicio,fechaFin)
   return diff;*/
   let split1 = fecha1.split("-"); //[0]=dia [1]=mes [2]= año
   let split2 = fecha2.split("-"); //[0]=dia [1]=mes [2]= año
   let fechaInicio = new Date(split1[2],split1[1],split1[0]).getTime(); //ARMO LA FECHA
   let fechaFin    = new Date(split2[2],split2[1],split2[0]).getTime(); //ARMO LA FECHA
   let diff = (fechaFin - fechaInicio)/(1000*60*60*24);
   return diff;
 }

 //RETORNA EL NUMERO DE TURNOS POR DIA
 const calcularTurnosPorDia = (hora1,hora2,duracion) =>{
    diff = (hora2-hora1)*60; //PASO LAS HORAS A MINUTOS
    nturnos = diff/duracion;
    return nturnos;
 }

 //SUMA DIAS A UNA FECHA ESPECIFICA
const sumarDias = (fecha, dias) => {
    //CONVIERTO EL STRING DE LA FECHA EN DATE 
    let f =  new Date(fecha);
    f.setDate(f.getDate() + dias);
    return f
}




//Exporto los metodos
module.exports = {
    listarTurnos,
    eliminarTurno,
    registrarTurno,
    actualizarTurno
}