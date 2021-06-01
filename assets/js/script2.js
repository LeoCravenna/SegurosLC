// SIMULADOR INTERACTIVO - COTIZADOR DE SEGUROS - PROYECTO FINAL ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Realizo una llamada a ajax y por medio de un Get obtengo el Json con las opciones del Selector
$(document).ready(function() {

    $.ajax({
      type: "GET",
      url: './assets/js/data/datos.json', 
      dataType: "json",
      success: function(data){
        $.each(data,function(key, registro) {
          $("#tipoSeguro").append('<option value='+registro.id+'>'+registro.tipo+'</option>');
        });      
      },
      error: function(data) {
        alert('error');
      }
    });

})

$('#btn_cotizar').click(function(e){
    e.preventDefault(); // Evita que se actualice la pág cuando enviamos el formulario

    let v_marca      = $('#marca').val();
    let v_modelo     = $('#modelo').val();
    let v_anio       = $('#anio').val();
    let v_tipoSeguro = $('#tipoSeguro').val();

    // VALIDACIÓN DE LOS CAMPOS DEL FORMULARIO
    if (v_marca == '') {

        $('#marca').css('width','690px');
        $('#mensaje1').fadeIn();
        return false;

    } else {

        $('#marca').css('width','100%');
        $('#mensaje1').fadeOut();

        if (v_modelo == '') {

            $('#modelo').css('width','680px');
            $('#mensaje2').fadeIn();
            return false;

        } else {

            $('#modelo').css('width','100%');
            $('#mensaje2').fadeOut();

            if (v_anio == '') {

                $('#mensaje3_1').fadeOut();
                $('#mensaje3_2').fadeOut();
                $('#anio').css('width','700px').fadeIn(4000);
                $('#mensaje3').fadeIn(4000);
                return false;

            } else if (v_anio.length > 4 || v_anio.length < 4) {

                $('#mensaje3').fadeOut();
                $('#mensaje3_2').fadeOut();
                $('#anio').css('width','690px').fadeIn(4000);
                $('#mensaje3_1').fadeIn(4000);
                return false;
            
            } else if (v_anio > ANIO_ACTUAL) {

                $('#mensaje3').fadeOut();
                $('#mensaje3_1').fadeOut();
                $('#anio').css('width','550px').fadeIn(4000);
                $('#mensaje3_2').fadeIn(4000);
                return false;    

            } else {    

                $('#anio').css('width','100%');
                $('#mensaje3').fadeOut();
                $('#mensaje3_1').fadeOut();
                $('#mensaje3_2').fadeOut();

                if (v_tipoSeguro == '') {

                    $('#tipoSeguro').css('width','735px');
                    $('#mensaje4').fadeIn();
                    return false;

                } else {

                    $('#tipoSeguro').css('width','100%');
                    $('#mensaje4').fadeOut();
                }
            }
        }
    }

    let v_valorSeguro = calculoCotizacion(v_anio,v_tipoSeguro); // Calculo el valor final del seguro en base al año del vehículo y el tipo del seguro elegido

    $.ajax({ // Muestro mensaje de alerta en caso de realizar bien o mal la simulación
        
        success: function(){

            //if(v_valorSinIva != 0 && v_valorSeguro != 0){
            if(v_valorSeguro != 0){

                $('#alerta').removeClass("hide").removeClass("alert-danger").removeClass("success").addClass("alert-success").css('display','block').fadeOut(4000);
                $('.respuesta').html("Simulación exitosa! ");
                $('.mensaje-alerta').html("La simulación se ha agregado al historial");
                
                agregarVehiculoALista(v_marca, v_modelo, v_anio, v_tipoSeguro, v_valorSeguro); // Llamo a la función del script.js y le paso los valores para agregar el objeto al array
                llenarTablaSimulaciones(v_marca, v_modelo, v_anio, v_tipoSeguro, v_valorSeguro); // paso por parámetro los valores para llenar las filas de la tabla
            
            } else {

                $('#alerta').removeClass("hide").removeClass("alert-danger").removeClass("success").addClass("alert-danger").css('display','block').fadeOut(4000);
                $('.respuesta').html("Error en la simulación! ");
                $('.mensaje-alerta').html("La simulación no se ha podido realizar");

            }    
        },
        error: function(){
            $('#alerta').removeClass("hide").removeClass("alert-danger").removeClass("success").addClass("alert-danger").css('display','block').fadeOut(4000);
            $('.respuesta').html("Error en la simulación! ");
            $('.mensaje-alerta').html("La simulación no se ha podido realizar");
            
        }

    }) 

})

////////////////////////////////////////////////////////////////////////////////////////////

function calculoCotizacion(v_anio,v_tipoSeguro){

    let valor_iva = IVA;
    let dif_anio = diferencia(v_anio);
    let val_tipoSeguro = valorTipo(v_tipoSeguro);
    let basico_seguro = val_tipoSeguro;

    val_tipoSeguro -= ((dif_anio*3)*val_tipoSeguro)/100; // al básico en base al tipo de seguro elegido, le resto el calculo de la diferencia de años por el 3%
    
    val_sinIva = val_tipoSeguro + basico_seguro; //sumo el valor generado anteriormente por la diferencia de años con el básico estipulado en base al tipo de seguro elegido
    
    let resul = val_sinIva * valor_iva; // al resultado anterior se lo multiplica por 1.3 que es el IVA.
    
    return resul.toFixed(2); // retorno el resultado final y si se excede de los dos decimales después del punto, trunca y redondea
}

function diferencia(v_anio) {
    
    return new Date().getFullYear() - v_anio; // retorno la diferencia que hay entre el año actual y el año pasado por parámetro

}

function valorTipo(v_tipoSeguro) {
    
    let valorSeguro  = 0;
    switch (v_tipoSeguro) {
        
        case "Basico":
            valorSeguro = BASICO;    
        break;
    
        case "Terceros_Completo":
            valorSeguro = TERCEROS_COMPLETO;    
        break;

        case "Terceros_Completo_Premium":
            valorSeguro = TERCEROS_COMPLETO_PREMIUM;    
        break;
    
        case "Todo_Riesgo":
            valorSeguro = TODO_RIESGO;    
        break;
    
        default:
        break;
    }

    return valorSeguro;

}

////////////////////////////////////////////////////////////////////////////////////////////

let cont = 0; //Esto va a ser el ID de cada Fila

function llenarTablaSimulaciones(v_marca, v_modelo, v_anio, v_tipoSeguro, v_valorSeguro) {
    
    cont++; //Suma uno por cada Simulación realizada

    let fila_id='<tr class="selected" id="fila'+cont+'" onclick="seleccionarFila(this.id);"><td>'+cont+'</td>';
    let fila_marca='<td>'+v_marca+'</td>';
    let fila_modelo='<td>'+v_modelo+'</td>';
    let fila_anio='<td>'+v_anio+'</td>';
    let fila_tipoSeguro='<td>'+v_tipoSeguro+'</td>';
    let fila_valorSeguro='<td>$'+v_valorSeguro+'</td>';

    // EN CASO DE QUERER BORRAR DE A UN ITEM A LA VEZ //
    //let btn_borrar = '<td><input id="btn_eliminarFila" type="button" class="btn btn-outline-danger" value="Borrar" onclick="eliminarFila('+cont+');" /></td></tr>';
    
    $('#tablaSimulaciones').append(fila_id+fila_marca+fila_modelo+fila_anio+fila_tipoSeguro+fila_valorSeguro);   

    reordenarFilas();

}

////////////////////////////////////////////////////////////////////////////////////////////

let id_fila_selected = [];                          // Inicializo el array vacío

function seleccionarFila(id_fila){

    if($('#'+id_fila).hasClass('seleccionada')){    // Si está seleccionado el ID, remuevo la clase y sacó el ID del array

        $('#'+id_fila).removeClass('seleccionada');
        id_fila_selected.splice(id_fila);

    } else {                                        // Sino, le agrego la clase y agrego el ID al array

        $('#'+id_fila).addClass('seleccionada');
        id_fila_selected.push(id_fila);

    }
    
    //id_fila_selected.push(id_fila);
}

////////////////////////////////////////////////////////////////////////////////////////////

function eliminarFila(id_fila){
    //CÓDIGO PARA ELIMINAR DE A UNO//
    /*$('#fila'+id_fila).remove();
    reordenarFilas();*/
    /////////////////////////////////

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn_confirmarAlerta btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    if (id_fila.length < 1) {           // Si el largo del array pasado por parámetro es menor a 1
        swalWithBootstrapButtons.fire(  // Muestro alerta de error ya que el array está vacío
            'Error!',
            'No se ha seleccionado ningúna cotización simulada',
            'error'
        )
    } else {                            // Sino, pregunta si querés borrar los items seleccionados o no
     
        swalWithBootstrapButtons.fire({
            title: '¿Borrar la/s simulación/es seleccionada/s?',
            text: "una vez borrada/s no se podrá/n recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {  // Si el resultado es "Si", remueve los items seleccionados, reordena la tabla y lanza alert de exito.

                for(let i = 0; i < id_fila.length; i++){
                    $('#'+id_fila[i]).remove();
                }
                reordenarFilas();
            
                swalWithBootstrapButtons.fire(
                    'Eliminada/s!',
                    'La/s simulación/es seleccionada/s fué/ron borrada/s',
                    'success'
                )                 

            } else if (result.dismiss === Swal.DismissReason.cancel) { // Sino, cancela operación y no borra ningún item seleccionado
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'No se borró ningúna simulación',
                    'error'
                )
            }
        })

    }

}

$('#btn_eliminarFila').click(function(){  // Llama a la función para eliminar items pasandole por parametro el array
    eliminarFila(id_fila_selected);
});

////////////////////////////////////////////////////////////////////////////////////////////

function eliminarTodasFilas(){
    
    let filas = $('#tablaSimulaciones tbody tr');

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn_confirmarAlerta btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: '¿Borrar todas las simulaciones?',
        text: "una vez borrada/s no se podrá/n recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar!',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {  // Si el resultado es "Si", remueve todos los items y lanza alert de exito.

            $('#tablaSimulaciones tbody tr').each(function(){
                $(this).remove(); // Remueve todas las filas que hay en el tbody
            });

            localStorage.removeItem("Simulaciones"); // Limpia el array de objetos guardado localmente
            
            swalWithBootstrapButtons.fire(
                'Eliminada/s!',
                'Todas las simulaciones han sido borradas',
                'success'
            )                 

        } else if (result.dismiss === Swal.DismissReason.cancel) { // Sino, cancela operación y no borra ningún item seleccionado
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'No se borró ningúna simulación',
                'error'
            )
        }
    })   
}

$('#btn_eliminarTodasFilas').click(function(){ // LLama a la función para eliminar todos los items
    eliminarTodasFilas();
});

////////////////////////////////////////////////////////////////////////////////////////////

function reordenarFilas(){ // Reordena las filas por ID
    let num=1;
    $('#tablaSimulaciones tbody tr').each(function(){
        $(this).find('td').eq(0).text(num);
        num++;
    });
}

////////////////////////////////////////////////////////////////////////////////////////////

function limpiarFormu() {

    $("form select").each(function() { this.selectedIndex = 0 }); //Limpia campos de select
    $("form input[type=text], form input[type=number]").each(function() { this.value = '' }); // Limpia campos de texto y númerico

}

$('#limpiarFormu').click(function(){ // Llama a la función para resetear los campos del formulario
    limpiarFormu();
});

////////////////////////////////////////////////////////////////////////////////////////////

function recuperar_datosFormulario() {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn_confirmarAlerta btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    if (!JSON.parse(localStorage.getItem("Simulaciones"))) { // si no puede recuperar datos del formulario porque no hay registro local

        swalWithBootstrapButtons.fire(  // Muestro alerta de error ya que no hay datos del formulario en el localstorege para recuperar
            'Error!',
            'No se encontraron datos guardados',
            'error'
        )

    } else {                           // Sino, pregunta si querés recuperar los datos del formulario de la última simulación realizada o no

        swalWithBootstrapButtons.fire({
            title: '¿Recuperar los datos cargados en el formulario?',
            text: "recuperarás los datos cargados en el fomulario de la última simulación realizada",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, recuperar!',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {  // Si el resultado es "Si", recupera todos los datos de la última simulación realizada y lanza alert de exito.

                let rec_simulaciones = JSON.parse(localStorage.getItem("Simulaciones"));

                if($('#marca').val() === ''){
                    $('#marca').val(rec_simulaciones[rec_simulaciones.length-1].marca); // muestro la última marca ingresada
                }
                    
                if($('#modelo').val() === ''){
                    $('#modelo').val(rec_simulaciones[rec_simulaciones.length-1].modelo); // muestro el último modelo ingresado
                }

                if($('#anio').val() === ''){
                    $('#anio').val(rec_simulaciones[rec_simulaciones.length-1].anio); // muestro el último año ingresado
                }

                if($('#tipoSeguro').val() === ''){
                    $('#tipoSeguro').val(rec_simulaciones[rec_simulaciones.length-1].tipoSeguro); // muestro el último tipo de seguro elegido
                }
                
                swalWithBootstrapButtons.fire(
                    'Recuperados!',
                    'Todos los datos de la última simulación realizada han sido recuperados y cargados en el formulario',
                    'success'
                )                 

            } else if (result.dismiss === Swal.DismissReason.cancel) { // Sino, cancela operación y no recupera ningún dato de la última simulación realizada
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'No se recuperó ningún dato de la última simulación realizada',
                    'error'
                )
            }
        })

    }  

}

$('#btn_recuperar_datos').click(function(){ // Llama a la función para borrar el array de objetos que está guardado localmente
    recuperar_datosFormulario();
});

////////////////////////////////////////////////////////////////////////////////////////////

function recuperar_Historial() {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn_confirmarAlerta btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    if (!JSON.parse(localStorage.getItem("Simulaciones"))) { // si no puede recuperar las simulaciones porque no hay registro local

        swalWithBootstrapButtons.fire(  // Muestro alerta de error ya que no hay info en el localstorege para recuperar
            'Error!',
            'No se encontraron cotizaciones anteriormente simuladas',
            'error'
        )

    } else {                           // Sino, pregunta si querés recuperar los items del historial o no

        swalWithBootstrapButtons.fire({
            title: '¿Recuperar historial de simulaciones?',
            text: "recuperarás el historial completo que anteriormente haz simulado",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, recuperar!',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {  // Si el resultado es "Si", recupera todos los items del historial y lanza alert de exito.

                let rec_historial = JSON.parse(localStorage.getItem("Simulaciones"));

                for (let i = 0; i < rec_historial.length; i++) { // recorro y recupero el array con las simulaciones y vuelvo a llenar la tabla 

                    llenarTablaSimulaciones(rec_historial[i].marca,rec_historial[i].modelo,rec_historial[i].anio,rec_historial[i].tipoSeguro,rec_historial[i].valorSeguro);

                }
                
                swalWithBootstrapButtons.fire(
                    'Recuperada/s!',
                    'Todo el historial de simulaciones ha sido recuperado',
                    'success'
                )                 

            } else if (result.dismiss === Swal.DismissReason.cancel) { // Sino, cancela operación y no recupera ningún item del historial
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'No se recuperó ningúna simulación del historial',
                    'error'
                )
            }
        })

    }

}

$('#btn_recuperarHistorial').click(function(){ // Llama a la función para recuperar el array de simulaciones con lo almacenado en el LocalStorage
    recuperar_Historial();
});

////////////////////////////////////////////////////////////////////////////////////////////