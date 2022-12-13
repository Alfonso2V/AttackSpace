function openWindowName() {
    document.getElementById('nameW').style.display = 'block';
    document.getElementById('buttonIniciar').disabled = true;
}

function closeWindowName() {
    document.getElementById('nameW').style.display = 'none';
    const button = document.getElementById('buttonIniciar');
    button.disabled = false
}

function getNombre() {
    const namePlayer = document.getElementById('nombreIngresado').value;
    sessionStorage.setItem('playerName', namePlayer)
    window.location = '/game.html'
}