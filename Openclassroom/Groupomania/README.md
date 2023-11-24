# Groupomania

Projet 7 de la formation développeur web de chez Openclassrooms

Le projet consiste à construire un réseau social interne pour les employés de Groupomania.
Le but de cet outil est de faciliter les interactions entre collègues.

Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et
a imaginé plusieurs briques pour favoriser les échanges entre collègues.


## Exigences émises par le comité de pilotage 
- la présentation des fonctionnalités doit être simple 
- la création d’un compte doit être simple et possible depuis un téléphone mobile
- le profil doit contenir très peu d’informations pour que sa complétion soit rapide 
- la suppression du compte doit être possible 
- l’accès à un forum où les salariés publient des contenus multimédias doit être présent
- l’accès à un forum où les salariés publient des textes doit être présent 
- les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés 
- le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre 
- le ou la chargé-e de communication Groupomania doit pouvoir afficher les dernières 
  participations des employés salariés


## Installation
- Une fois votre utilisateur sql configuré, copier le fichier configDatabase.sql
  dans votre système de gestion mySql.
- Se placer dans le dossier "backend"
- Accéder au fichier .env pour remplacer le nom d'utilisateur sql 
  et le mot de passe, ou si besoin aller directement dans le dossier
  "models" et dans le fichier "data-base.js" .   
- Exécutez `npm install`
- Exécutez `nodemon server` 
- Ouvrir un terminal et se placer dans le dossier "frontend" 
- Exécutez `npm install` 
- Exécutez `ng serve`

Si vous souhaitez utiliser l'application en tant qu'administrateur :
- S'inscrire sur le site groupomania pour créer un utilisateur, se déconnecter. 
- Depuis mySql : UPDATE User SET is_admin=1 WHERE email='votre E-mail';
- Une fois reconnecté la mention "Administrateur" sera présente à l'écran dans le header.
