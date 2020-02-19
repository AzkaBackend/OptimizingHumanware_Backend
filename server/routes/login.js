const express = require('express');

const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

const Empresa = require('../models/empresa');

const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    Empresa.findOne({ email: body.email }, (err, empresaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Empresa) o contraseña incorrectos'
                }
            });
        }


        if (!bcrypt.compareSync(body.password, empresaDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa o (contraseña) incorrectos'
                }
            });
        } else {
            return res.status(200).json({
                message: `Bienvenido, ${ body.email }`
            });
        }

        // let token = jwt.sign({
        //     empresa: empresaDB
        // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        // res.json({
        //     ok: true,
        //     empresa: empresaDB,
        //     token
        // });


    });

});







module.exports = app;