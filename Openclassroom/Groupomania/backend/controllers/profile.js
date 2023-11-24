const database = require('../models/data-base');
const jwt = require('jsonwebtoken');

exports.getAllProfile = (req, res, next) => {
  database.promise().query(`SELECT name, first_name FROM User WHERE is_admin=0;`)
    .then(data => res.status(200).json((JSON.parse(JSON.stringify(data[0])))))
    .catch(error => res.status(400).json({ error }))
  ;
}

exports.getOneProfile = (req, res, next) => {
  database.promise().query(`SELECT name, first_name, is_admin FROM User WHERE email= ?;`, [req.params.id])
    .then(data => {
      if ((data[0])[0] == null) {
        return res.status(404).json({ error: 'Aucun utilisateur n\'est enregistré avec cette email' })
      }
      res.status(200).json((JSON.parse(JSON.stringify(data[0])))[0]);
    })
    .catch(error => res.status(500).json({ error }))
  ;
}

exports.deleteProfile = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  database.promise().query(`DELETE FROM User WHERE email= ?;`, [user])
    .then(() =>res.status(201).json({ message: 'Votre profil a été supprimé!' }))
    .catch(error => res.status(400).json({ error }))
  ;  
}

exports.deleteOneProfile = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  database.promise().query(`SELECT is_admin FROM User WHERE email= ?;`, [user])
    .then(data => {
      const userInfo = (JSON.parse(JSON.stringify(data[0])))[0];
      if (userInfo.is_admin !== 1) {
        return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer ce profil"})
      }
      database.promise().query(`DELETE FROM User WHERE email= ? AND is_admin != 1;`, [req.params.id])
        .then(() => res.status(200).json({ message: 'Ce profil a été supprimé!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }))  
}