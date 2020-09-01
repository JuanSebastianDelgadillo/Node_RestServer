require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//HABILITAR LA CARPETA PUBLIC
app.use(express.static(path.resolve(__dirname, '../public')));

console.log();

//CONFIGURACION GLOBAL DE ROUTES
app.use(require('./controllers/routes'));

(async() => {
    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }, (err, res) => {
            if (err) throw err;
            console.log('Mongo is ONLINE');
        });

    } catch (err) {
        console.log('error: ' + err);
    }
})()

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});