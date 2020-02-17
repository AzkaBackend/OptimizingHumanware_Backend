// Basic connection
const { Pool } = require('pg');

const config = {
    host: 'localhost',
    user: 'postgres',
    password: 'Urud@t4bas3',
    database: 'library'
};

const pool = new Pool(config);

const getBooks = async() => {
    try {
        const res = await pool.query('select * from books');
        // console.log(res)
        console.log(res.rows);
        // pool.end();
    } catch (e) {
        console.log(e);
    }
};

const insertUser = async() => {
    try {
        const text = 'INSERT INTO users(username, password) VALUES ($1, $2)';
        const values = ['Carlos', 'paye12345'];

        const res = await pool.query(text, values);
        console.log(res);
        // pool.end();
    } catch (e) {
        console.log(e);
    }
};

const deleteUser = async() => {
    try {
        const text = 'DELETE FROM users WHERE username = $1';
        const value = ['Carlos'];
        const res = await pool.query(text, value);
        console.log(res)
            // pool.end();
    } catch (e) {
        console.log(e);
    }
};

const editUser = async() => {
    const text = 'UPDATE users SET username = $1, password = $2 WHERE username = $3';
    const values = ['Juan Carlos', 'payito58', 'Carlos'];
    const res = await pool.query(text, values);
    console.log(res)
    pool.end();
};

getBooks();
//insertUser();
//deleteUser();
//editUser();