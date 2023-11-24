const Sauce = require('../models/Sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));  
};

exports.modifyOneSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId !== userId) {
        return res.status(403).json({ error: "Vous n'avez pas le droit de modifier cette sauce"})
      }
      const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: `La sauce '${req.params.id}' a été modifiée !`}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId !== userId) {
        return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer cette sauce"})
      }
      const fileName = sauce.imageUrl.split('/images/')[1];
      fs.unlink (`images/${fileName}`, () => { 
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: `La sauce '${req.params.id}' a été supprimée !`}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(404).json({ error }));
};

exports.createStateLike = (req, res, next) => {
  switch (req.body.like) {
    case 0 :
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { 
              $inc: { likes: -1 }, 
              $pull: { usersLiked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: "Votre like a bien été annulé."}))
            .catch(error => res.status(400).json({ error }));
          } else {
            Sauce.updateOne({ _id: req.params.id }, { 
              $inc: { dislikes: -1 }, 
              $pull: { usersDisliked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: "Votre dislike a bien été annulé."}))
            .catch(error => res.status(400).json({ error }));
          }
        })
        .catch(error => res.status(404).json({ error }));
      break; 
    case 1:
      Sauce.updateOne({ _id: req.params.id }, { 
        $inc: { likes: +1 }, 
        $addToSet: { usersLiked: req.body.userId }
      })
      .then(() => res.status(201).json({ message: "Votre like a bien été pris en compte."}))
      .catch(error => res.status(400).json({ error }));
      break;
    case -1:
      Sauce.updateOne({ _id: req.params.id }, { 
        $inc: { dislikes: +1 }, 
        $addToSet: { usersDisliked: req.body.userId }
      })
      .then(() => res.status(201).json({ message: "Votre dislike a bien été pris en compte."}))
      .catch(error => res.status(400).json({ error }));
      break;
  }
};