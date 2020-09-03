const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');
const Producto = require('../models/producto');
const app = express();

//========================
// OBTENER PRODUCTOS
//========================
app.get('/productos', (req, res) => {
    //trae todos los productos
    //populate: usuario categoria

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;
    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('categoria')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productosDB,
                    conteo
                });
            });
        });


});

//========================
// OBTENER PRODUCTOS POR ID
//========================
app.get('/productos/:id', (req, res) => {
    //populate: usuario categoria
    //paginado

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })



        });

});

//========================
// BUSQUEDA DE UN PRODUCTO
//========================


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                err: true,
                productos: productosDB
            })


        })


});


//========================
// CREAR NUEVO PRODUCTO
//========================
app.post('/productos', verificaToken, (req, res) => {
    //graba el usuario
    //graba una categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,


    })

    producto.save((err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productosDB
        })
    });
});


//========================
// ACTUALIZAR PRODUCTO
//========================
app.put('/productos/:id', (req, res) => {
    //graba el usuario
    //graba una categoria del listado
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Los datos son requeridos'
                }
            });
        }

        res.json({
            ok: true,
            producto: productosDB
        });
    });
});


//========================
// BORRAR PRODUCTO
//========================
app.delete('/productos/:id', (req, res) => {
    //graba el usuario
    //graba una categoria del listado

    let id = req.params.id;



    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Los datos son requeridos'
                }
            });
        }

        res.json({
            ok: true,
            message: {
                message: 'Producto eliminado'
            }
        });
    });


});



module.exports = app;