const URL = 'https://http-nodejs-production-0dd3.up.railway.app/api/scores';

axios.get(URL).then((result) => {
    createTable(result.data);
}).catch((err) => {
    console.log(err)
});

function enviarScore(score, namePlayer) {
    if (sessionStorage.getItem('guardar') == "true") {
        axios.post(URL, {
            "name": namePlayer,
            "score": score
        })
    }
    sessionStorage.setItem('guardar', false);
}