const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');

const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
});

router.get('/', (req, res) => {
    res.json({
        message: 'Key'
    });
});

router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        users.findOne({
            username: req.body.username
        }).then(user => {
            if(user) {
                const error = new Error('User name already exists!');
                next(error);
            } else {
                bcrypt.hash(req.body.password, 8)
                .then(hashedPassword => {
                    const newUser = {
                        username: req.body.username,
                        password: hashedPassword
                    };
                    users.insert(newUser).then(insertedUser => {
                        res.json(insertedUser)
                    })
                })
            }
        })
    } else {
        next(result.error)
    }
});

module.exports = router;