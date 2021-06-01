// SIMULADOR INTERACTIVO - COTIZADOR DE SEGUROS - AGREGADO DE JQUERY ///////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

const BASICO = 2000;
const TERCEROS_COMPLETO = 2500;
const TERCEROS_COMPLETO_PREMIUM = 3500;
const TODO_RIESGO = 5000;
const IVA = 1.21;
const ANIO_ACTUAL = new Date().getFullYear();

let vehiculos = [];

function obtenerInfoSimulaciones() {
    
    if (JSON.parse(localStorage.getItem("Simulaciones"))) {
        
        JSON.parse(localStorage.getItem("Simulaciones")); // vuelvo a convertir a Objeto el array de simulaciones que estaba en String

    } else {

        console.log("No se encontraron registros en el LocalStorage");

    }

}

function agregarVehiculoALista(v_marca, v_modelo, v_anio, v_tipoSeguro, v_valorSeguro){

    let nuevoVehiculo = {
        marca: v_marca,
        modelo: v_modelo,
        anio: v_anio,
        tipoSeguro: v_tipoSeguro,
        valorSeguro: v_valorSeguro
    }

    vehiculos.push(nuevoVehiculo);

    localStorage.setItem("Simulaciones", JSON.stringify(vehiculos)); //Transformo el array que contiene las simulaciones en String
    obtenerInfoSimulaciones();

}

////////////////////////////////////////////////////////////////////////////////////////

function obtenerVehiculos() {
    return vehiculos; // Retorno la lista con los vehiculos que cotizé
}

////////////////////////////////////////////////////////////////////////////////////////