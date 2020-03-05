import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Helper from './Helper';

const Empresa = {
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} reflection object 
     */
    async crearEmpresa(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Faltan algunos datos' });
        }
        if (!Helper.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Por favor, ingrese una dirección de correo electrónico válida' });
        }
        const hashPassword = Helper.hashPassword(req.body.password);

        const createQuery = `INSERT INTO
        empresas(activo, empresa, nombre_completo, email, empleo, cantidad_usuarios, pais, cp, estado, direccion, numero_telefonico, password, password_confirmacion, imagen, id_dispositivo, fecha_creacion, fecha_modificacion)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
     * @returns {object} user object 
     */
    async login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Some values are missing' });
        }
        if (!Helper.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }
        const text = 'SELECT * FROM users WHERE email = $1';
        try {
            const { rows } = await db.query(text, [req.body.email]);
            if (!rows[0]) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
            if (!Helper.comparePassword(rows[0].password, req.body.password)) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
            const token = Helper.generateToken(rows[0].id);
            // return res.status(200).send({ token });
            return res.status(200).send({ 'message': 'Bienvenido ', email });
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    /**
     * Delete A User
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return status code 204 
     */
    async delete(req, res) {
        const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
        try {
            const { rows } = await db.query(deleteQuery, [req.user.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'user not found' });
            }
            return res.status(204).send({ 'message': 'deleted' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default Empresa;