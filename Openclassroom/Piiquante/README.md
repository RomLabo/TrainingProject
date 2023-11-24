# Piiquante

Projet 6 de la formation développeur web de chez Openclassrooms

Dans ce projet on nous demande de construire une API sécurisée pour une application d'avis gastronomiques.
Le front-end de l'application a été développé à l'aide d'Angular.

## Contexte du projet
Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées 
secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise 
souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter 
leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres. 

## Exigences de sécurité
- Le mot de passe de l'utilisateur doit être haché.
- L'authentification doit être renforcée sur toutes les routes sauce requises.
- Les adresses électroniques dans la base de données sont uniques et un
plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler 
les erreurs. 
- La sécurité de la base de données MongoDB (à partir d'un service tel que 
MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
machine d'un utilisateur. 
- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
de données. 
- Les versions les plus récentes des logiciels sont utilisées avec des correctifs
de sécurité actualisés. 
- Le contenu du dossier images ne doit pas être téléchargé sur GitHub. 


## Installation
- Ouvrir un terminal et se placer dans le dossier "frontend"
- Exécutez `npm install`
- Exécutez `npm start` 
- Se placer dans le dossier "backend" 
- Exécutez `npm install` 
- Exécutez `npm start` 
