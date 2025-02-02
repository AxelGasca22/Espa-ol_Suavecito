async function cargarEjercicios() {
    try {
        const response = await fetch('json/A1.json');
        const data = await response.json();
        mostrarEjercicios(data);
    } catch (error) {
        console.error("Error cargando los ejercicios:", error);
    }
}

function mostrarNombresEjercicios(data) {
    const ejercicios = data.ejercicios.items || [];
    const contenedor = document.getElementById("ejercicios-container");
    
    if (!ejercicios.length) {
        contenedor.innerHTML = "<p>No hay ejercicios disponibles.</p>";
        return;
    }
    
    // Añadir nombres de los ejercicios al contenedor
    ejercicios.forEach((ej, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<p><strong>Ejercicio ${index + 1}:</strong> ${ej.ingles}</p>`;
        contenedor.appendChild(div);
    });
}

function mostrarEjercicios(data) {
    const ejercicio = data.ejercicios;
    const instrucciones = ejercicio.instructions || "Sigue las instrucciones para completar los ejercicios.";
    const ejercicios = ejercicio.items || [];
    const contenedor = document.getElementById("ejercicios-container");
    
    if (!ejercicios.length) {
        contenedor.innerHTML = "<p>No hay ejercicios disponibles.</p>";
        return;
    }
    
    // Añadir instrucciones al contenedor
    const instruccionesDiv = document.createElement("div");
    instruccionesDiv.innerHTML = `<p><strong>Instrucciones:</strong> ${instrucciones}</p>`;
    contenedor.appendChild(instruccionesDiv);
    
    ejercicios.forEach((ej, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${ej.ingles}</strong></p>
            <input type="text" class="texto-respuesta" id="respuesta-${index}" placeholder="Escribe la traducción">
            <button class="boton-verificar" onclick="verificar(${index}, '${ej.espanol}')">Verificar</button>
            <p id="resultado-${index}"></p>
        `;
        contenedor.appendChild(div);
    });
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

document.addEventListener("DOMContentLoaded", cargarEjercicios);