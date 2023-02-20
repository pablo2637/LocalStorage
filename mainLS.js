'use strict'

document.addEventListener("DOMContentLoaded", () => {
    /*Variables*/
    const ulListaFrutas = document.querySelector("#lista");
    const olListaCesta = document.querySelector("#listaUser");
    const btnVaciarCesta = document.querySelector("#vaciarCesta");
    const fragment = document.createDocumentFragment();
    const arrayFrutasCesta = JSON.parse(localStorage.getItem('arrayFrutas')) || [];

    const arrayFrutas = ["Manzana", "Pera", "Mandarina", "Kiwi", "Naranja", "Melocoton", "Sandia", "Melon",
        "mandarina"];


    /*Eventos*/
    ulListaFrutas.addEventListener('click', ({ target }) => {   //Evento de la lista (ul) que contiene las frutas
        if (target.matches("button")) {                         //y sus respectivos botones.
            operacionesFrutas(...target.classList);
        }
    })

    btnVaciarCesta.addEventListener('click', () => {            //Evento del botón 'vaciar cesta' => borra las
        localStorage.clear();                                   //frutas del array y borra todo el local storage.
        arrayFrutasCesta.splice(0);
        pintarOlCesta();
    })


    /*Funciones*/
    const pintarOlCesta = () => {                               //Pinta en el DOM las fruta seleccionadas
        olListaCesta.innerHTML = "";
        arrayFrutasCesta.forEach(fruta => {
            let liFruta = document.createElement("LI");
            liFruta.textContent = fruta.toUpperCase();
            fragment.append(liFruta);
        })
        olListaCesta.append(fragment);
    }


    const operacionesFrutas = (accion, fruta) => {               //datosFruta es un array (boton.classList) que        
        if (accion == "agregar") {                              //nos indica la acción a realizar y la fruta.
            guardarFrutaLS(fruta);
        } else {
            eliminarFrutaLS(fruta);
        }
        pintarOlCesta();
    }


    const guardarFrutaLS = fruta => {                           //Guarda la fruta en el array y en local storage.
        // Si descomentas estas lineas sólo deja agregar 1 fruta de cada tipo...

        // if (!arrayFrutasCesta.includes(fruta)) {
            arrayFrutasCesta.push(fruta);
            localStorage.setItem("arrayFrutas", JSON.stringify(arrayFrutasCesta));
        // }
    }


    const eliminarFrutaLS = fruta => {                          //Elimina la fruta del array y del local storage.
        if (arrayFrutasCesta.includes(fruta)) {
            arrayFrutasCesta.splice(arrayFrutasCesta.lastIndexOf(fruta), 1);
            localStorage.setItem("arrayFrutas", JSON.stringify(arrayFrutasCesta));
        }
    }


    const agregarFrutaLista = fruta => {
        const liFruta = document.createElement("LI");           //Crea los elementos de la lista para el DOM.
        liFruta.textContent = fruta;
        liFruta.id = fruta.toLowerCase();

        const divBotones = document.createElement("DIV");

        const btnAgregar = document.createElement("BUTTON");    //En la clase del boton se almacena la acción
        btnAgregar.textContent = "Agregar";                     //y la fruta. (AGREGAR)
        btnAgregar.classList.add("agregar", liFruta.id)

        const btnEliminar = document.createElement("BUTTON");   //En la clase del boton se almacena la acción
        btnEliminar.textContent = "Eliminar";                   //y la fruta. (ELIMINAR)
        btnEliminar.classList.add("eliminar", liFruta.id)

        divBotones.append(btnAgregar, btnEliminar);
        liFruta.append(divBotones);
        fragment.append(liFruta);
    }


    const buscarFrutas = () => {                                //Recorre el array para agregar las frutas.
        arrayFrutas.forEach(fruta => agregarFrutaLista(fruta));
        ulListaFrutas.append(fragment);
    }

    buscarFrutas();
    pintarOlCesta();
})