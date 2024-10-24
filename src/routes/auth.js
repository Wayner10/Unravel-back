const express = require('express');
const bcrypt = require('bcryptjs');
const Client = require('../database/db_unravel');
const { generateToken, verifyToken, blacklistToken } = require('../jwt');
const router = express.Router();

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
    const { user_name, user_lastname, user_email, user_password, user_phone, user_birthdate, user_status, user_type_id } = req.body;
    const hashedPassword = await bcrypt.hash(user_password, 10);

    try {
        const result = await Client.query(
            'INSERT INTO tb_users (user_name, user_lastname, user_email, user_password, user_phone, user_birthdate, user_status, user_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id',
            [user_name, user_lastname, user_email, hashedPassword, user_phone, user_birthdate, user_status, user_type_id]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        const result = await Client.query('SELECT * FROM tb_users WHERE user_email = $1', [user_email]);
        const user = result.rows[0];

        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = generateToken(user);

        await Client.query(
            'INSERT INTO tb_user_tokens (user_token_code, user_id) VALUES ($1, $2)',
            [token, user.user_id]
        );

        res.json({ token });
    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta de cierre de sesión
router.post('/logout', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(400).json({ error: 'Token no proporcionado' });
    }

    try {
        // Eliminar el token de la base de datos
        await Client.query('DELETE FROM tb_user_tokens WHERE user_token_code = $1', [token]);

        // Agregar el token a la lista negra si es necesario
        blacklistToken(token);

        res.sendStatus(200);
    } catch (err) {
        console.error('Error al cerrar sesión:', err.message);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
});


// Ruta protegida de administrador
router.get('/admin', async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const decoded = verifyToken(token);
        const result = await Client.query('SELECT * FROM tb_user_tokens WHERE user_token_code = $1', [token]);
        if (result.rows.length > 0) {
            res.send('Acceso a la ruta de administrador');
        } else {
            res.status(401).send('Token inválido o en lista negra');
        }
    } catch (err) {
        res.status(401).send('Token inválido o en lista negra');
    }
});

router.post('/verify-token', (req, res) => {
    const token = req.body.token;
    try {
        const decoded = verifyToken(token);
        res.json({ valid: true, decoded });
    } catch (err) {
        res.status(401).json({ valid: false, error: 'Token inválido' });
    }
});

module.exports = router;
