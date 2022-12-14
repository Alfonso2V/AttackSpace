// Titulo en howToPlay
$(".header").append("<div class='glitch-window'>Como jugar</div>");
$("h1.glitched").clone().appendTo(".glitch-window");
// Tabla dinamica en puntuaciones
function createTable(data) {
    // Ordenamiento mayor a menor
    data.sort((a, b) => {
            if (a.score == b.score) {
                return 0;
            }
            if (a.score > b.score) {
                return -1;
            }
            return 1;
        })
        // Fin ordenamiento
    const Top5 = data.slice(0, 5); //Solo enviar los primero 5 valores mas altos
    let contador = 0;
    Top5.map(row => {
        contador++;
        $('table').append(`<tr><td>${contador}</td><td>${row.name}</td><td>${row.score}</td></tr>`);
    })

}
let button = document.querySelector('.buttonPuntuaciones');
let buttonText = document.querySelector('.tick');

const tickMark = `<svg width="58" height="45" viewBox="0 0 58 45" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="nonzero" d="M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65"></svg>`;

buttonText.innerHTML = "Guardar puntuacion?";

button.addEventListener('click', function() {
    if (buttonText.innerHTML !== "Guardar puntuacion?") {
        buttonText.innerHTML = "Guardar puntuacion?";
        sessionStorage.setItem('guardar', false);
    } else if (buttonText.innerHTML === "Guardar puntuacion?") {
        sessionStorage.setItem('guardar', true);
        buttonText.innerHTML = tickMark;
    }
    this.classList.toggle('buttonPuntuaciones__circle');
});