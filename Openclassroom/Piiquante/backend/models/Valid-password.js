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

module.exports = validPasswordSchema;