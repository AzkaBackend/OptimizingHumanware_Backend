// server.js
import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import ReflectionWithJsObject from './src/usingJSObject/controllers/Reflection';
import ReflectionWithDB from './src/controller/Reflection';
import UserWithDb from './src/controller/Usuarios';
import Empresa from './src/controller/Empresa';
import Auth from './src/middleware/Auth';
import Dispositivo from './src/controller/Dispositivo';

dotenv.config();
const Reflection = process.env.TYPE === 'db' ? ReflectionWithDB : ReflectionWithJsObject;
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'Endpoint trabajando' });
});

app.post('/api/v1/reflections', Auth.verifyToken, Reflection.create);
app.get('/api/v1/reflections', Reflection.getAll);
app.get('/api/v1/reflections/:id', Auth.verifyToken, Reflection.getOne);
app.put('/api/v1/reflections/:id', Auth.verifyToken, Reflection.update);
app.delete('/api/v1/reflections/:id', Auth.verifyToken, Reflection.delete);
app.post('/api/v1/usuarios', UserWithDb.create);
app.post('/api/empresa/registro', Empresa.crearEmpresa);
app.post('/api/v1/usuarios/login', UserWithDb.login);
app.delete('/api/v1/usuarios/me', Auth.verifyToken, UserWithDb.delete);

// api.get('/api/dispositivo', Dispositivo.verDispositivos);

app.listen(3000)
console.log('Servidor escuchando en puerto: ', 3000);