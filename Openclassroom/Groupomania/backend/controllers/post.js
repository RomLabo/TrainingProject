const database = require('../models/data-base');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { userInfo } = require('os');

exports.getAllPosts = (req, res, next) => {
  database.promise().query(`SELECT *, TIMESTAMPDIFF(DAY, created_at, NOW()) AS nb_days,
  TIMESTAMPDIFF(HOUR, created_at, NOW()) AS nb_hours, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS nb_minutes 
  FROM Post ORDER BY id DESC;`)
    .then(data => res.status(200).json((JSON.parse(JSON.stringify(data[0])))))
    .catch(error => res.status(400).json({ error }));
}

exports.getOnePost = (req, res, next) => {
  database.promise().query(`SELECT * FROM Post WHERE id= ?`, [req.params.id])
    .then(data => res.status(200).json((JSON.parse(JSON.stringify(data[0])))[0]))
    .catch(error => res.status(404).json({ error }));
}


exports.getAllComments = (req, res, next) => {
  database.promise().query(`SELECT *, TIMESTAMPDIFF(DAY, created_at, NOW()) AS nb_days,
  TIMESTAMPDIFF(HOUR, created_at, NOW()) AS nb_hours, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS nb_minutes 
   FROM Comment WHERE post_id= ? ORDER BY id DESC;`, [req.params.id])
    .then(data => res.status(200).json((JSON.parse(JSON.stringify(data[0])))))
    .catch(error => res.status(400).json({ error }));
}

exports.createPost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  const reqHost = req.get('host');
  const postTitle = JSON.parse(req.body.postTitle);
  const postText = JSON.parse(req.body.postText);
  let imageUrl = 'imageUrl';
  if (req.file) {
    imageUrl = `${req.protocol}://${reqHost}/images/${req.file.filename}`;
  }
  database.promise().query(`INSERT INTO Post (id, user_email, content, title, image_url, user_name, user_firstname, created_at) 
    VALUES (NULL, ?, ?, ?, ?, (SELECT name FROM User WHERE email= ?), (SELECT first_name FROM User WHERE email= ?), NOW());`,
    [user, postText, postTitle, imageUrl, user, user])
    .then(() => res.status(201).json({ message: ' Post enregistré !'}))
    .catch(error => res.status(400).json({ error }))
}

exports.modifyPost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  const reqHost = req.get('host');
  const postTitle = JSON.parse(req.body.postTitle);
  const postText = JSON.parse(req.body.postText);
  database.promise().query(`SELECT * FROM Post WHERE id= ?`, [req.params.id])
  .then(data => {
    const post = (JSON.parse(JSON.stringify(data[0])))[0];
    if (post.user_email !== user) {
      return res.status(403).json({ error: "Vous n'avez pas le droit de modifier ce post"})
    } else {
      if (req.file) {
        const fileName = post.image_url.split('/images/')[1];
        fs.unlink (`images/${fileName}`, () => {
          imageUrl = `${req.protocol}://${reqHost}/images/${req.file.filename}`;
          database.promise().query(`UPDATE Post SET content= ?, title= ?, image_url= ?, created_at= NOW() WHERE id= ? AND user_email= ?;`,
          [postText, postTitle, imageUrl, req.params.id, user])
            .then(() => res.status(200).json({ message: 'Post Modifié !'}))
            .catch(error => res.status(400).json({ error }));
        })
      }  else {
        database.promise().query(`UPDATE Post SET content= ?, title= ?, created_at= NOW() WHERE id= ? AND user_email= ?;`,
          [postText, postTitle, req.params.id, user])
          .then(() => res.status(200).json({ message: 'Post Modifié !'}))
          .catch(error => res.status(400).json({ error }));
      }
    }
  })
  .catch(error => res.status(404).json({ error }));    
}

exports.createComment = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  database.promise().query(`INSERT INTO Comment (id, post_id, user_email_comment, content, user_name_comment, user_firstname_comment, created_at) 
    VALUES (NULL, ?, ?, ?, (SELECT name FROM User WHERE email= ?), (SELECT first_name FROM User WHERE email= ?), NOW());`,
    [req.params.id, user, req.body.commentText, user, user]) 
    .then(() => res.status(201).json({ message: ' Commentaire enregistré !'}))
    .catch(error => res.status(400).json({ error }))
}

exports.createStateLike = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  switch (req.body.likeNumber) {
    case 0 :
      database.promise().query(`SELECT * FROM Like_state WHERE user_like_email= ? AND post_id =?;`, [user, req.params.id])
        .then(data => {
          const userLike = (JSON.parse(JSON.stringify(data[0])))[0];
          const userLikeStatus = userLike.user_like;
          if (userLikeStatus === 1) {
            database.promise().query(`UPDATE Post SET post_like =post_like - 1 WHERE id= ?`, [req.params.id])
            .then(() => {
              database.promise().query(`DELETE FROM Like_state WHERE user_like_email= ? AND id= ?;`,[user, userLike.id])
                .then(() =>  res.status(201).json({ message: 'Votre vote a été annulé !' }))
                .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json({ error }));
          } else {
            database.promise().query(`UPDATE Post SET post_like =post_like + 1 WHERE id= ?`,[req.params.id])
            .then(() => {
              database.promise().query(`DELETE FROM Like_state WHERE user_like_email= ? AND id= ?;`,[user, userLike.id])
                .then(() =>  res.status(201).json({ message: 'Votre vote a été annulé !' }))
                .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json({ error }));
          }
        })
        .catch(error => res.status(500).json({ error })); 
      break; 
    case 1:
      database.promise().query(`UPDATE Post SET post_like = post_like + 1 WHERE id= ?`,[req.params.id]) 
      .then(() => {
        database.promise().query(`INSERT INTO Like_state (id, user_like_email, post_id, user_like) VALUES (NULL, ?, ?, ?)`,[user, req.params.id, req.body.likeNumber])
          .then(() => res.status(201).json({ message: "Votre vote a bien été enregistré !"}))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(400).json({ error }));
      break;
    case -1:
      database.promise().query(`UPDATE Post SET post_like =post_like - 1 WHERE id= ?`,[req.params.id])
      .then(() => {
        database.promise().query(`INSERT INTO Like_state (id, user_like_email, post_id, user_like) VALUES (NULL, ?, ?, ?)`,[user, req.params.id, req.body.likeNumber])
          .then(() => res.status(201).json({ message: "Votre vote a bien été enregistré !"}))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(400).json({ error }));
      break;
  }
}

exports.getOneLiker = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  database.promise().query(`SELECT user_like FROM Like_state WHERE user_like_email= ? AND post_id= ?`,[user, req.params.id])
    .then(data => res.status(200).json((JSON.parse(JSON.stringify(data[0])))[0]))
    .catch(error => res.status(404).json({ error }));
}

exports.deleteOnePost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  database.promise().query(`SELECT image_url FROM Post WHERE id= ?`, [req.params.id])
  .then(data => {
    const post = (JSON.parse(JSON.stringify(data[0])))[0];
    database.promise().query(`SELECT is_admin FROM User WHERE email= ?;`, [user])
      .then(data => {
        const userInfo = (JSON.parse(JSON.stringify(data[0])))[0];
        if (userInfo.is_admin === 1 ) {
          const fileName = post.image_url.split('/images/')[1];
          fs.unlink (`images/${fileName}`, () => {
            database.promise().query(`DELETE FROM Post WHERE id= ?;`,[req.params.id])
              .then(() => {
                database.promise().query(`DELETE FROM Comment WHERE post_id= ?;`,[req.params.id])
                .then(() =>{
                  database.promise().query(`DELETE FROM Like_state WHERE post_id= ?;`,[req.params.id])
                    .then(() => res.status(200).json({ message: 'Le post a bien été supprimé'}))
                    .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(400).json({ error }));
              })
              .catch(error => res.status(400).json({ error }));
          })
        } else {
          const fileName = post.image_url.split('/images/')[1];
          fs.unlink (`images/${fileName}`, () => {
            database.promise().query(`DELETE FROM Post WHERE id= ? AND user_email= ?;`,[req.params.id, user])
            .then(() => {
              database.promise().query(`DELETE FROM Comment WHERE post_id= ?;`,[req.params.id])
              .then(() =>{
                database.promise().query(`DELETE FROM Like_state WHERE post_id= ?;`,[req.params.id])
                  .then(() => res.status(200).json({ message: 'Le post a bien été supprimé'}))
                  .catch(error => res.status(400).json({ error }));
              })
              .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json({ error }));
          })
        }
      })
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(404).json({ error }));
}

exports.deleteOneComment = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user = decodedToken.user;
  database.promise().query(`SELECT is_admin FROM User WHERE email= ?;`, [user])
    .then(data => {
      const userInfo = (JSON.parse(JSON.stringify(data[0])))[0];
      if (userInfo.is_admin !== 1) {
        return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer ce commentaire"})
      }
      database.promise().query(`DELETE FROM Comment WHERE id= ?;`,[req.params.id])
        .then(() =>res.status(200).json({ message: 'Le commentaire a bien été supprimé'}))
        .catch(error => res.status(404).json({ error }));
    })
    .catch(error => res.status(500).json({ error }))
}

