const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Empresa = require('../models/empresa');
// const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


// app.get('/empresa', verificaToken, (req, res) => {
app.get('/empresa', (req, res) => {

    // return res.json({
    //     empresa: req.empresa,
    //     nombre: req.empresa.nombre,
    //     email: req.empresa.email
    // })

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Empresa.find({ activo: true }, 'nombre email role activo google img')
        .skip(desde)
        .limit(limite)
        .exec((err, empresas) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Empresa.count({ activo: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    empresas,
                    cuantas: conteo
                });

            });

        });

});

// app.post('/empresa', [verificaToken], function(req, res) {
app.post('/empresa', function(req, res) {

    let body = req.body;

    let empresa = new Empresa({
        empresa: body.empresa,
        nombreCompleto: body.nombreCompleto,
        email: body.email,
        empleo: body.empleo,
        cantidadUsuarios: body.cantidadUsuarios,
        pais: body.pais,
        cp: body.cp,
        estado: body.estado,
        direccion: body.direccion,
        numeroTelefono: body.numeroTelefono,
        password: bcrypt.hashSync(body.password, 10),
        passwordConfirmacion: bcrypt.hashSync(body.passwordConfirmacion, 10),
        activo: body.activo
    });


    empresa.save((err, empresaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            empresa: empresaDB
        });


    });


});

// app.put('/empresa/:id', [verificaToken], function(req, res) {
app.put('/empresa/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, [
        'empresa',
        'nombreCompleto',
        'email',
        'empleo',
        'cantidadUsuarios',
        'pais',
        'cp',
        'estado',
        'direccion',
        'numeroTelefono',
        'activo'
    ]);

    Empresa.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, empresaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            empresa: empresaDB
        });

    })

});

// app.delete('/empresa/:id', [verificaToken], function(req, res) {
app.delete('/empresa/:id', function(req, res) {


    let id = req.params.id;

    // Empresa.findByIdAndRemove(id, (err, empresaBorrada) => {

    let cambiaActivo = {
        activo: false
    };

    Empresa.findByIdAndUpdate(id, cambiaActivo, { new: true }, (err, empresaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!empresaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            empresa: empresaBorrada
        });

    });



});



module.exports = app;