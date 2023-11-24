const validPassword = require('../models/Valid-password');

module.exports = (req, res, next) => {
    try {
        if (!validPassword.validate(req.body.password)) {
            throw 'Invalid model of password';
        } else {
            next();
        }    
    } catch {
        res.status(401).json({
            message: 'Le mot de passe doit contenir entre 8 et 15 caractères, dont 1 majuscule, 1 minuscule, 2 chiffres et 1 caractère spécial'
        });
    }  
};

