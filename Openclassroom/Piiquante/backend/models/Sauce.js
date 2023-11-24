const mongoose = require('mongoose');
const sauceInfoRegex = /^[A-Za-z\é\è\ê\ï\-,.: ]+$/;

const validator = (val) =>  sauceInfoRegex.test(val);
const custom = [validator, `{PATH} ne doit pas contenir de caractères spéciaux autre que ',' '.' '-' ':' .`]

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { 
        type: String,
        minLength: [3, "Le nom doit avoir minimum 3 caractères"],
        maxLength: [30, "Le nom doit avoir maximum 30 caractères"],
        validate: custom,
        required: true },
    manufacturer: {
        type: String,
        minLength: [3, "Le nom du fabricant doit avoir minimum 3 caractères"],
        maxLength: [30, "Le nom du fabricant doit avoir maximum 30 caractères"],
        validate: custom,
        required: true },
    description: {
        type: String,
        minLength: [3, "La description doit avoir minimum 3 caractères"],
        validate: custom,
        required: true },
    mainPepper: {
        type: String,
        minLength: [3, "Le nom d\'ingrédient doit avoir minimum 3 caractères"],
        maxLength: [30, "Le nom d\'ingrédient doit avoir maximum 30 caractères"],
        validate: custom,
        required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array },
    usersDisliked: { type: Array },
});

module.exports = mongoose.model('Sauce', sauceSchema);



