async function cargarTitulos() {
    try {
        const response = await fetch('json/A1.json');
        const data = await response.json();
        mostrarTitulos(data);
    } catch (error) {
        console.error("Error cargando los títulos:", error);
    }
}

function mostrarTitulos(data) {
    const ejercicios = data.ejercicios || [];
    const contenedor = document.getElementById("titulos-container");
    
    if (!ejercicios.length) {
        contenedor.innerHTML = "<p>No hay títulos disponibles.</p>";
        return;
    }
    
    // Añadir títulos al contenedor en forma de cards
    ejercicios.forEach((ejercicio, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${ejercicio.titulo}</h5>
                <a href="#" data-id="${index}" onclick="mostrarEjercicio(event, ${index})">Ver Ejercicio</a>
                <div class="ejercicio-contenedor" id="ejercicio-${index}" style="display: none;"></div>
                <button class="btn-contraer" onclick="contraerEjercicio(${index})" style="display: none;">Contraer</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function mostrarEjercicio(event, index) {
    event.preventDefault();
    
    fetch('json/A1.json')
        .then(response => response.json())
        .then(data => {
            const ejercicio = data.ejercicios[index];
            const contenedor = document.getElementById(`ejercicio-${index}`);
            contenedor.innerHTML = `
                <p><strong>${ejercicio.instructions}</strong></p>
            `;
            if (ejercicio.tipo === 'traduccion') {
                ejercicio.items.forEach((ej, itemIndex) => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <p><strong>${ej.ingles}</strong></p>
                        <input type="text" class="texto-respuesta" id="respuesta-${itemIndex}" placeholder="Escribe la traducción">
                        <button class="boton-verificar" onclick="verificar(${itemIndex}, '${ej.espanol}')">Verificar</button>
                        <p id="resultado-${itemIndex}"></p>
                    `;
                    contenedor.appendChild(div);
                });
            } else if (ejercicio.tipo === 'acompletar') {
                ejercicio.items.forEach((ej, itemIndex) => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <p><strong>${ej.oracion}</strong></p>
                        <input type="text" class="texto-respuesta" id="respuesta-${itemIndex}" placeholder="Completa la oración">
                        <button class="boton-verificar" onclick="verificar(${itemIndex}, '${ej.respuesta}')">Verificar</button>
                        <p id="resultado-${itemIndex}"></p>
                    `;
                    contenedor.appendChild(div);
                });
            } else if (ejercicio.tipo === 'opcion_multiple') {
                contenedor.innerHTML += `<p>${ejercicio.lectura}</p>`;
                ejercicio.items.forEach((ej, itemIndex) => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <p><strong>${ej.pregunta}</strong></p>
                        ${ej.opciones.map((opcion, opcionIndex) => `
                            <div>
                                <input type="radio" id="respuesta-${itemIndex}-${opcionIndex}" name="respuesta-${itemIndex}" value="${opcion}">
                                <label for="respuesta-${itemIndex}-${opcionIndex}">${opcion}</label>
                            </div>
                        `).join('')}
                        <button class="boton-verificar" onclick="verificarOpcionMultiple(${itemIndex}, '${ej.respuesta}')">Verificar</button>
                        <p id="resultado-${itemIndex}"></p>
                    `;
                    contenedor.appendChild(div);
                });
            }
            contenedor.style.display = 'block';
            document.querySelector(`.btn-contraer[onclick="contraerEjercicio(${index})"]`).style.display = 'block';
        })
        .catch(error => console.error("Error cargando el ejercicio:", error));
}

function contraerEjercicio(index) {
    const contenedor = document.getElementById(`ejercicio-${index}`);
    contenedor.style.display = 'none';
    document.querySelector(`.btn-contraer[onclick="contraerEjercicio(${index})"]`).style.display = 'none';
}

function verificar(index, respuestaCorrecta) {
    let input = document.getElementById(`respuesta-${index}`).value.trim();
    const resultado = document.getElementById(`resultado-${index}`);
    
    // Eliminar espacios adicionales
    input = input.replace(/\s+/g, ' ');
    respuestaCorrecta = respuestaCorrecta.replace(/\s+/g, ' ');

    // Agregar punto final si no está presente
    if (!input.endsWith('.')) {
        input += '.';
    }
    if (!respuestaCorrecta.endsWith('.')) {
        respuestaCorrecta += '.';
    }

    // Normalizar las cadenas eliminando tildes
    input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    respuestaCorrecta = respuestaCorrecta.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Comparar palabra por palabra
    const inputWords = input.toLowerCase().split(' ');
    const correctWords = respuestaCorrecta.toLowerCase().split(' ');
    let resultHTML = '';

    const maxLength = Math.max(inputWords.length, correctWords.length);

    for (let i = 0; i < maxLength; i++) {
        if (inputWords[i] === correctWords[i]) {
            resultHTML += `<span style="color: green;">${inputWords[i]}</span> `;
        } else {
            resultHTML += `<span style="color: red;">${inputWords[i] || ''}</span> `;
        }
    }

    resultado.innerHTML = resultHTML.trim();
}

function verificarOpcionMultiple(index, respuestaCorrecta) {
    const opciones = document.getElementsByName(`respuesta-${index}`);
    let seleccionada = '';
    for (const opcion of opciones) {
        if (opcion.checked) {
            seleccionada = opcion.value;
            break;
        }
    }
    const resultado = document.getElementById(`resultado-${index}`);
    if (seleccionada === respuestaCorrecta) {
        resultado.innerHTML = `<span style="color: green;">Correcto</span>`;
    } else {
        resultado.innerHTML = `<span style="color: red;">Incorrecto.</span>`;
    }
}

document.addEventListener("DOMContentLoaded", cargarTitulos);