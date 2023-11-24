---- TP3_Groupe033_ManipulationDonnées_Requêtes ----
        -- JOINTURES --
-- 1) Noms des écoles rattachées au restaurant "A La Cantine"
SELECT E.nom
FROM ECOLE E JOIN RESTAURANT R 
ON E.codeRestau = R.code
WHERE R.nom = 'A La Cantine';

-- 2) Le tarif de la restauration scolaire avec un revenu annuel 14000 €
SELECT P.tarif
FROM PAYER P
JOIN PRESTATION PR ON P.codePrestation = PR.code
JOIN TRANCHE T ON P.codeTranche = T.code
WHERE T.revenuPlancher <= 14000
AND T.revenuPlafond > 14000
AND PR.libelle = 'restauration scolaire';

        -- FONCTION AGREGRATION --
-- 3) Le tarif maximum pour la prestation restauration scolaire
SELECT MAX(P.tarif) AS tarif_max_restauration_scolaire
FROM PAYER P JOIN PRESTATION PR 
ON P.codePrestation = PR.code
WHERE PR.libelle = 'restauration scolaire';

-- 4) Le nombre total d'enfant de l'école Saint Bernard
SELECT COUNT(E.code) AS nombre_enfants_ecole_stBernard
FROM ENFANT E JOIN ECOLE EC 
ON E.codeEcole = EC.code
WHERE EC.nom = 'Ecole Saint Bernard';

        -- ORDER BY --
-- 5) Les noms, prenoms et date de naissance de tous les enfants 
--    par ordre alphabétique de nom et ensuite de prénom
SELECT E.nom, E.prenom, E.dateNaiss
FROM ENFANT E
ORDER BY E.nom ASC, E.prenom ASC;

-- 6) Les noms et nombre d'enfant des familles triées par nombre 
--    d'enfant décroissant
SELECT F.nomChef, F.nbEnfants
FROM FAMILLE F
ORDER BY F.nbEnfants DESC;

        -- GROUP BY --
-- 7) Le nombre total d'inscription pour chaque prestation
SELECT P.libelle, COUNT(I.codePrestation) AS nb_inscriptions
FROM INSCRIRE I
JOIN PRESTATION P 
ON I.codePrestation = P.code
GROUP BY P.libelle;

-- 8) le nombre total de familles dans chaque tranche de revenu
SELECT T.revenuPlancher, T.revenuPlafond, COUNT(F.code) AS nb_familles
FROM FAMILLE F JOIN TRANCHE T 
ON F.codeTranche = T.code
GROUP BY T.revenuPlancher, T.revenuPlafond;

-- 9) Le nombre total de prestations différentes proposées 
--    par chaque école
SELECT E.nom, COUNT(DISTINCT I.codePrestation) AS nbPrestations
FROM INSCRIRE I JOIN ENFANT EN 
ON I.codeEnfant = EN.code
JOIN ECOLE E ON EN.codeEcole = E.code
GROUP BY E.nom;

        -- GROUP BY HAVING --
-- 10) Les écoles proposant plus de deux prestations
SELECT e.nom, COUNT(i.codePrestation) AS nb_prestations
FROM INSCRIRE i
JOIN ENFANT en ON i.codeEnfant = en.code
JOIN ECOLE e ON en.codeEcole = e.code
GROUP BY e.nom
HAVING COUNT(i.codePrestation) > 2;

-- 11) Les familles ayant plus de deux enfants inscrits à des prestations
SELECT f.nomChef, f.prenomChef, COUNT(i.codeEnfant) AS nbEnfantsInscrits
FROM INSCRIRE i
JOIN ENFANT e ON i.codeEnfant = e.code
JOIN FAMILLE f ON e.codeFamille = f.code
GROUP BY f.nomChef, f.prenomChef
HAVING COUNT(i.codeEnfant) > 2;

-- 12) Le tarif total payé par nom de chef de famille trié 
--     par ordre alphabéthique
SELECT F.nomChef, SUM(P.tarif) AS total_prestation
FROM FAMILLE F JOIN PAYER P 
ON F.codeTranche = P.codeTranche
GROUP BY F.nomChef
HAVING SUM(P.tarif) > (SELECT AVG(tarif) FROM PAYER)
ORDER BY F.nomChef ASC;

        -- SOUS REQUETE --
-- 13) Afficher les noms des famille dont le code tranche de 
--     revenus est < à la tranche 3
SELECT F.nomChef
FROM FAMILLE F
WHERE F.code IN (SELECT code FROM famille  WHERE codeTranche < 3);

-- 14) Afficher les toutes les information sur les enfants 
--     qui s'appellent "noah"
SELECT *
FROM ENFANT E
WHERE E.code IN (SELECT code  FROM ENFANT WHERE nom ='noah');

-- 15) Sélectionner les enfants qui sont inscrits à 
--     une prestation spécifique depuis le 12/10/2018
SELECT E.nom, E.prenom
FROM enfant E
WHERE code IN (SELECT codeEnfant E FROM inscrire WHERE codePrestation = 2  
AND dateInscrip >= '12/10/2018');

-- 16) Le nom prénom et téléphone des agents de service 
--     qui ont le statut de responsable
SELECT A.nom, A.prenom, A.tel
FROM AGENTDESERVICE A
WHERE A.nom IN (SELECT A.nom FROM AGENTDESERVICE A WHERE A.responsable ='OUI');