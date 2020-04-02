const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Key'
    });
});

router.post('/signup', (req, res) => {
    console.log('body', req.body)
    res.json({
        message: 'OK!'
    });
});

module.exports = router;