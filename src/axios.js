const URL = 'https://http-nodejs-production-0dd3.up.railway.app/api/scores';

axios.get(URL).then((result) => {
    createTable(result.data);
}).catch((err) => {
    console.log(err)
});

function enviarScore(score) {
    console.log(score)
}
// enviarScore();