import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Helper from './Helper';

const Usuario = {
    /**
     * Create A Usuario
     * @param {object} req 
     * @param {object} res
     * @returns {object} reflection object 
     */
    async create(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Faltan algunos datos' });
        }
        if (!Helper.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Por favor, ingrese una dirección de correo electrónico válida' });
        }
        const hashPassword = Helper.hashPassword(req.body.password);

        const createQuery = `INSERT INTO
                            usuarios(id, email, password, fecha_creacion, fecha_modificacion)
                            VALUES($1, $2, $3, $4, $5)
                            returning *`;
        const values = [
            uuidv4(),
            req.body.email,
            hashPassword,
            moment(new Date()),
            moment(new Date())
        ];

        try {
            const { rows } = await db.query(createQuery, values);
            const token = Helper.generateToken(rows[0].id);
            // return res.status(201).send({ token });
            return res.status(201).send({ 'message': 'Usuario creado satisfactoriamente' });
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ 'message': 'El usuario con ese EMAIL ya existe' })
            }
            return res.status(400).send(error);
        }
    },
    /**
     * Login
     * @param {object} req 
     * @param {object} res
     * @returns {object} usuario object 
     */
    async login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Faltan algunos datos' });
        }
        if (!Helper.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Por favor, ingrese una dirección de correo electrónico válida' });
        }
        const text = 'SELECT * FROM usuarios WHERE email = $1';
        try {
            const { rows } = await db.query(text, [req.body.email]);
            if (!rows[0]) {
                return res.status(400).send({ 'message': 'Las credenciales que proporcionó son incorrectas' });
            }
            if (!Helper.comparePassword(rows[0].password, req.body.password)) {
                return res.status(400).send({ 'message': 'Las credenciales que proporcionó son incorrectas' });
            }
            const token = Helper.generateToken(rows[0].id);
            // return res.status(200).send({ token });
            return res.status(200).send({ 'message': 'Bienvenido ', email });
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    /**
     * Delete A Usuario
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return status code 204 
     */
    async delete(req, res) {
        const deleteQuery = 'DELETE FROM usuarios WHERE id=$1 returning *';
        try {
            const { rows } = await db.query(deleteQuery, [req.usuario.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'Usuario no encontrado' });
            }
            return res.status(204).send({ 'message': 'Eliminado' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default Usuario;