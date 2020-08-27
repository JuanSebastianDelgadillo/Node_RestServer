// ===================
// PUERTO
//====================
process.env.PORT = process.env.PORT || 3000;

// ===================
// ENTORNO
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://spider:cVtfqUJ79vpziZz0@cluster0.gyfn1.mongodb.net/cafe';
}

process.env.URLDB = urlDB;