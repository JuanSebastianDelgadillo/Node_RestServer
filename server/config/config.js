// ===================
// PUERTO
//====================
process.env.PORT = process.env.PORT || 3000;

// ===================
// VENCIMIENTO DE TOKEN
//====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===================
// SEED de autenticacion
//====================


process.env.SEED = process.env.SEED || 'este-es-elseed-desarrollo';


// ===================
// ENTORNO
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===================
// Google Client ID
//====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '336611721455-6pl7c911e5oduki6nalfj0po51e67gqg.apps.googleusercontent.com';