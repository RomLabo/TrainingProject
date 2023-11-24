const passwordValidator  = require ('password-validator');

const validPasswordSchema = new passwordValidator ();

validPasswordSchema
.is().min(8)                                    // Minimum 8 caractères
.is().max(15)                                   // Maximum 15 caractères
.has().uppercase()                              // Doit contenir au moins une lettre majuscule
.has().lowercase()                              // Doit contenir au moins une lettre minuscule
.has().digits(2)                                // Doit contenir au moins deux nombres
.has().symbols()                                // Doit contenir au moins un caractère spécial
.has().not().spaces()                           // Ne doit pas contenir d'espace



module.exports = (req, res, next) => {
    try {
        if (!validPasswordSchema.validate(req.body.user.password)) {
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



