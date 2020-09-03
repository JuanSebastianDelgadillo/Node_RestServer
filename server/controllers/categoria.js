const express = require('express');
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');
let app = express();
const _ = require('underscore');
let Categoria = require('../models/categoria');

//=============================
// MOSTRAR TODAS LAS CATEGORIAS 
//=============================
app.get('/categoria', (req, res) => {

    Categoria.find()
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categoriasDB,
                    conteo
                })
            })
        })
});

//=============================
// MOSTRAR UNA CATEGORIA POR ID
//=============================

app.get('/categoria/:id', (req, res) => {

    let body = req.body;

    Categoria.findOne({ id: body.id }, (err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoriasDB
        });

    });
});

//=============================
// CREAR UNA CATEGORIA
//=============================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriasDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriasDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriasDB
        });

    });
});

//=============================
// EDITAR UNA CATEGORIA
//=============================


app.put('/categoria/:id', (req, res) => {
    //regresa la nueva categoria
    //req.usuario.id

    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La descripcion es obligatoria'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


//=============================
// ELIMINAR CATEGORIA
//=============================


app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });

});


module.exports = app;