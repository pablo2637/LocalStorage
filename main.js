'use strict'

document.addEventListener("DOMContentLoaded", () => {

    /*Variables*/
    const ulListaFrutas = document.querySelector("#lista");
    const olListaCesta = document.querySelector("#listaUser");
    const btnVaciarCesta = document.querySelector("#vaciarCesta");
    const fragment = document.createDocumentFragment();

    const arrayFrutasCesta = JSON.parse(localStorage.getItem('arrayFrutas')) || [];

    const arrayFrutas = [
        { id: 'f1', nombre: "Manzana", cantidad: 7, valor: 1, cesta: 0 },
        { id: 'f2', nombre: "Pera", cantidad: 5, valor: 0.6, cesta: 0 },
        { id: 'f3', nombre: "Mandarina", cantidad: 8, valor: 0.8, cesta: 0 },
        { id: 'f4', nombre: "Kiwi", cantidad: 9, valor: 1.2, cesta: 0 },
        { id: 'f5', nombre: "Melocoton", cantidad: 2, valor: 0.5, cesta: 0 },
        { id: 'f6', nombre: "Sandia", cantidad: 3, valor: 2.25, cesta: 0 },
        { id: 'f7', nombre: "Melon", cantidad: 12, valor: 2, cesta: 0 },
        { id: 'f8', nombre: "Cereza", cantidad: 6, valor: 1.5, cesta: 0 }
    ];


    /*Eventos*/

    //Evento de la lista (ul) que contiene las frutas y sus respectivos botones.
    ulListaFrutas.addEventListener('click', ({ target }) => {

        if (target.matches("i"))
            operacionesFrutas(...target.parentNode.classList);

    });


    //Evento del botón 'vaciar cesta' => borra las frutas del array y borra todo el local storage.        
    btnVaciarCesta.addEventListener('click', () => {

        localStorage.removeItem('arrayFrutas');

        arrayFrutasCesta.splice(0);
        arrayFrutas.forEach(fruta => fruta.cesta = 0);

        pintarOlCesta();

    });


    /*Funciones*/

    //Pinta en el DOM las fruta seleccionadas
    const pintarOlCesta = () => {

        olListaCesta.innerHTML = "";
        const arrayFrutasLocal = getLocal();

        arrayFrutasLocal.forEach(({ nombre, valor, cesta }) => {

            if (cesta > 0) {

                const liFruta = document.createElement("LI");
                liFruta.textContent = nombre;

                const pStock = document.createElement("P");
                pStock.textContent = `x${cesta}`;

                const pValor = document.createElement("P");
                pValor.innerHTML = `Precio: <span class="precioCesta">${(valor * cesta).toFixed(2)}€</span>`;

                liFruta.append(pStock, pValor)
                fragment.append(liFruta);
            }

        });

        olListaCesta.append(fragment);
        actualizarStockLista();

    };


    //La clase del boton nos indica la acción a realizar y la fruta.
    const operacionesFrutas = async (accion, id) => {

        try {

            if (accion == "agregar")
                await guardarFrutaLS(id);
            else
                eliminarFrutaLS(id);

            pintarOlCesta();

        } catch (error) {
            console.log("operacionesFrutas error: ", error);

        }

    };


    //Guarda en el Local Storage.
    const addLocal = () => {

        localStorage.setItem("arrayFrutas", JSON.stringify(arrayFrutasCesta));
    };


    //Recupera del Local Storage.
    const getLocal = () => {

        return JSON.parse(localStorage.getItem('arrayFrutas')) || [];
    };


    //Guarda la fruta en el array y en Local Storage.        
    const guardarFrutaLS = async (id) => {

        const objFruta = arrayFrutas.find(fruta => fruta.id == id);

        let stockLS = objFruta.cesta;

        if (stockLS > 0) {
            const indFrutaCesta = arrayFrutasCesta.findIndex(fruta => fruta.id == id);
            arrayFrutasCesta[indFrutaCesta].cesta = stockLS + 1;

        } else {
            objFruta.cesta = stockLS + 1;
            arrayFrutasCesta.push(objFruta);

        }

        addLocal();
    };


    //Elimina la fruta del array y del local storage.
    const eliminarFrutaLS = async (id) => {

        const objFruta = arrayFrutas.find(fruta => fruta.id == id);
        const indFrutaCesta = arrayFrutasCesta.findIndex(fruta => fruta.id == id);

        objFruta.cesta -= 1;
        arrayFrutasCesta[indFrutaCesta].cesta = objFruta.cesta;

        if (objFruta.cesta == 0)
            arrayFrutasCesta.splice(indFrutaCesta, 1);

        addLocal();
        pintarOlCesta();

    };


    //Actualiza el stock de la lista de productos
    const actualizarStockLista = () => {

        arrayFrutas.forEach(({ id, cantidad, cesta }) => {

            const pStock = document.querySelector(`#${id}-stock`);
            const btnAgregar = document.querySelector(`.agregar.${id}`);
            const btnEliminar = document.querySelector(`.eliminar.${id}`);

            pStock.textContent = cantidad - cesta;
            if (cesta == 0)
                btnEliminar.disabled = true;

            else
                btnEliminar.disabled = false;


            if ((cantidad - cesta) == 0)
                btnAgregar.disabled = true;

            else
                btnAgregar.disabled = false;

        });
    };

    //Crea los elementos de la lista para el DOM.
    const pintarLiFrutas = ({ id, nombre, cantidad, valor }, ind) => {

        const liFruta = document.createElement("LI");
        liFruta.textContent = nombre;
        liFruta.id = id;

        const divBotones = document.createElement("DIV");
        divBotones.classList.add("divContainer");

        const btnAgregar = document.createElement("BUTTON");    //En la clase del boton se almacena la acción
        // btnAgregar.textContent = "Agregar";                     //y la fruta. (AGREGAR)
        btnAgregar.innerHTML = `<i class="fa-solid fa-square-plus"></i>`;
        btnAgregar.classList.add("agregar", id)

        const btnEliminar = document.createElement("BUTTON");   //En la clase del boton se almacena la acción
        // btnEliminar.textContent = "Eliminar";                   //y la fruta. (ELIMINAR)
        btnEliminar.classList.add("eliminar", id)
        btnEliminar.innerHTML = `<i class="fa-solid fa-square-minus"></i>`;

        const pStock = document.createElement("P");
        let cestaLS = arrayFrutasCesta.find(fruta => fruta.id == id)?.cesta;

        if (cestaLS) {
            arrayFrutas[ind].cesta = cestaLS;
            pStock.innerHTML = `Stock: <span id="${id}-stock">${cantidad - cestaLS}</span>`;

        } else {
            pStock.innerHTML = `Stock: <span id="${id}-stock">${cantidad}</span>`;

        }

        const pValor = document.createElement("P");
        pValor.innerHTML = `Precio: <span>${(valor).toFixed(2)}€</span>`;

        divBotones.append(btnAgregar, btnEliminar);
        liFruta.append(divBotones, pStock, pValor);
        fragment.append(liFruta);
    };


    //Recorre el array para agregar las frutas.        
    const buscarFrutas = () => {

        arrayFrutas.forEach((fruta, ind) => pintarLiFrutas(fruta, ind));
        ulListaFrutas.append(fragment);

    };

    buscarFrutas();
    pintarOlCesta();

}); //Load