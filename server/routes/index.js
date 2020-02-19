const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./empresa'));



module.exports = app;