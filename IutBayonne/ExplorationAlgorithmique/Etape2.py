# -*- coding: utf-8 -*-
"""
SAE 2.02 EXPLORATION ALGORITHMIQUE D'UN PROBLEME
Created on Thu Mar 30 09:39:11 2023
@author: Kessentini_Nour & Laborde_Romain
Etape 2 : RECHERCHE DU PLUS COURTS CHEMINS
"""

from math import *
import time
import pandas as pd
import numpy as np
import os 
os.chdir('C:/Documents/semestre2/s202')
os.getcwd()

""" 
Tests réalisés sur la matrice des poids du fichier 'matpoids.csv' de la SAE. 
"""
#bellmanFordKalaba(matPoids, 'point5', 'point12')  
    # Temps : 14.711 secondes
    # Solution : point5, point10, point12    distance : 366.41
    
#bellman(matPoids, 'point5', 'point12')            
    # Temps : 0.718 secondes
    # Solution : point5, point10, point12    distance : 366.41
    
#dijkstra(matPoids, 'point5','point12')           
    # Temps : 2.135 secondes 
    # Solution : point5, point10, point12    distance : 366.41
    
#mwPred = matricesfloydWarshall(matPoids) 
#floydWarshall(matPoids,mWPred,'point5','point12') 

""" 
Tests réalisés sur notre matrice --------------------------
"""
#dijkstra(notreMatricePoids, 'S_2','S_12')
""" Solution : 
- chemin : ['S_2', 'S_8', 'S_5', 'S_10', 'S_11', 'S_12']
- distance: 1066.182075926173
- Temps exécution : 2.5287258625030518 """
#aStar(notreMatricePoids,'S_2','S_12')
""" Solution : 
- chemin : ['S_2', 'S_8', 'S_5', 'S_10', 'S_11', 'S_12']
- distance: 1066.182075926173
- Temps exécution : 0.015620231628417969 """

#bellman(notreMatricePoids,'S_2','S_12')
""" Solution : 
- chemin : ['S_2', 'S_8', 'S_5', 'S_10', 'S_11', 'S_12']
- distance: 1066.182075926173
- Temps exécution : 0.34207820892333984 """

#bellmanFordKalaba(notreMatricePoids,'S_2','S_12')
""" Solution : 
- chemin : ['S_2', 'S_8', 'S_5', 'S_10', 'S_11', 'S_12']
- distance: 1066.182075926173
- Temps exécution : 9.145078182220459 """

"""
CREATION MATRICE DE POIDS -----------------------------
"""
# Création dataframe à partir du fichier "Ressources" SAE 2.02
mat_poids=pd.read_table('matpoids.csv', sep=',', index_col='Unnamed: 0',
                        encoding='latin_1')
# Création dataframe contenant l'indice et nom du sommet
listePoint=pd.read_table('listepoint.csv', sep=',', index_col='index', 
                        encoding='latin_1')
# Création dataframe "notre_liste_points" pour calculer l'heuristique
notre_liste_points=pd.read_table('notreListePoints.csv', sep=',', index_col='Unnamed: 0',
                        encoding='latin_1')

# Transformation dataframe "notre_liste_points" en dictionnaire
# préparation des données pour calculer notre heuristique
notreListePoints = {}
for index,row in notre_liste_points.iterrows():
    notreListePoints[row[1]] = row[0].split(',')
for key in notreListePoints:
    for i in range(len(notreListePoints[key])):
        notreListePoints[key][i] = float(notreListePoints[key][i])
        
# Importation de notre matrice de poids obtenue à l'étape 1
notre_mat_poids=pd.read_table('notreMatricePoids.csv', sep=',', index_col='Unnamed: 0',
                            encoding='latin_1')
# Transformation du dataframe "mat_poids" en liste de liste
matPoids=mat_poids.values.tolist()

# Transformation du dataframe "notre_mat_poids" en liste de liste
notreMatricePoids=notre_mat_poids.values.tolist()

""" POUR LA MATRICE ET LISTE FOURNIES EN RESSOURCES """
# Permet d'associer le nom du sommet (point) à son indice dans matPoids
#def nom_sommet(indice):
    #return listePoint.iloc[indice][0]
# Permet d'associer l'indice du sommet (point) à son nom, listePoint
#def indice_sommet(nompoint):
    #return listePoint.loc[listePoint['nompoints'] == nompoint].index.item()

""" POUR NOTRE MATRICE ET NOTRE LISTE """
# Permet d'associer le nom du sommet (point) à son indice dans matricePoids
def nom_sommet(indice):
    return "S_" + str(indice+1)
# Permet d'associer l'indice du sommet (point) à son nom, nompoint
def indice_sommet(nompoint):
    return int(nompoint.split("_")[1])-1
        
"""
LISTE SUCCESSEURS ---------------------------------
"""
def listSucc(poids,sommet):
    """
    Permet de retourner la liste de
    successeurs de "sommet" dans la
    matrice des poids.

    Parameters
    ----------
    poids : mMtrice des poids
    sommet : Sommet de départ

    Returns
    -------
    succ : La liste des successeurs de sommet
    """
    #Initialisation
    succ = []
    n = len(poids)
    for i in range(n):
        if poids[sommet][i] != float('inf'):
            succ.append(i)
    return succ
    
"""
RELACHEMENT ARC ----------------------------------
"""
def relacherArc(u,v,poids,dist,pred):
    """
    Consiste à regarder si en passant
    par l'arc (u,v) nous obtenons un
    accès au sommet v de poids inférieur
    à celui que nous avions jusque-là, si
    c'est le cas on met à jour la distance 
    de v et son prédécesseur.
    
    Parameters
    ----------
    u : Sommet arc (u,v)
    v : Sommet arc (u,v)
    poids : Matrice des poids
    dist : Liste des distances minimales
    pred : Liste des prédécesseurs
    
    Returns
    -------
    changement : Indique si il y un accès
                de poids inférieur
    """
    #initialisation
    changement = False
    # Traitements
    if dist[u] + poids[u][v] < dist[v]:
        changement = True
        dist[v] = dist[u] + poids[u][v]
        pred[v] = u  
    return changement

"""
EXTRACTION SOMMET ---------------------------------
"""
def extract_min(list_som,dist):
    """
    Permet d'extraire de "list_som"
    le sommet ayant la plus petite
    distance dans la liste "dist"

    Parameters
    ----------
    list_som : Liste des sommets
    dist : Liste des distances

    Returns
    -------
    s : Le sommet ayant la plus petite distance
    """
    # Initialisation
    n = len(list_som)
    s = 0
    # Traitements
    for i in range(1,n):
        if dist[list_som[i]] < dist[list_som[s]]:
            s = i
    return list_som.pop(s)  

"""
PLUS COURT CHEMIN DE S A S' ----------------------------------
"""
def plusCourtChemin(u,v,dist,pred):
    """
    Reconstitue le chemin entre le sommet "u"
    et le sommet "v" à l'aide de la liste des 
    prédécesseurs.
    
    Parameters
    ----------
    u : Indice du sommet d'arrivée
    v : Indice du sommet de départ
    dist : Liste des distances
    pred : Liste des prédécésseurs

    Returns
    -------
    chemin : La liste des sommets composant le plus 
            court chemin
    distance : La distance du plus court chemin
    """
    chemin=[nom_sommet(u),nom_sommet(v)]
    distance=dist[v]
    while pred[v] != u:
        v = pred[v]
        chemin.insert(1, nom_sommet(v))
    return (chemin,distance) 

def plusCourtCheminMatrice(u,v,matPoids,matPred):
    """
    Reconstitue le chemin entre le sommet "u"
    et le sommet "v" à l'aide de la Matrice des 
    prédécesseurs.

    Parameters
    ----------
    u : Indice du sommet d'arrivée
    v : Indice du sommet de départ.
    matPoids : Matrice des poids
    matPred : Matrice des prédécesseurs

    Returns
    -------
    chemin : La liste des sommets composant le plus 
            court chemin
    distance : La distance du plus court chemin
    """
    chemin=[nom_sommet(u),nom_sommet(v)]
    distance = matPoids[u][v]
    while matPred[u][v] != u:
        v = matPred[u][v]
        chemin.insert(1, nom_sommet(v))
    return (chemin,distance)

""" 
DIJKSTRA -----------------------------------
"""
def dijkstra(poids, som_dep, som_arr):
    """
    Permet de déterminer dans le graphe
    pondéré à valuation positive décrit
    par la liste de liste "poids",
    les chemins de longueur 
    minimum du sommet "som_dep" vers 
    tous les autres sommets
    Détecte les valuations négatives.
    
    Parameters
    ----------
    poids : Matrice des poids
    som_dep : Nom du sommet de départ
    som_arr : Nom du sommet d'arrivée

    Returns
    -------
    chemin : Liste des noms des sommets composant
            le plus court chemin
    distance : Distance du plus court chemin
    """
    # Initialisation
    n = len(poids)
    L = [i for i in range(n)]
    dist = [float("inf")]*n
    pred = [None]*n
    s = indice_sommet(som_dep)
    dist[s] = 0
    contientValuationNegative = False
    # Traitements
    startTime = time.time() # Déclenchement du timer
    
    while (L != []) & (contientValuationNegative == False) :
        s = extract_min(L,dist)
        for val in listSucc(poids,s):
            # Détection valuation négative
            if poids[s][val] < 0 :
                contientValuationNegative = True
                break
            relacherArc(s, val, poids, dist, pred)
    
    endTime = time.time() # Arrêt du timer
    
    if contientValuationNegative == True:
        print('Pas de solution _ Contient des valuations négatives')
        return [],0
    resultChemin = plusCourtChemin(indice_sommet(som_dep), indice_sommet(som_arr), dist, pred)
    chemin = resultChemin[0]
    distance = resultChemin[1]
    print('Solution : \n - chemin : ' + str(chemin) + '\n - distance: ' + str(distance) + '\n - Temps exécution : ' + str(endTime - startTime))
    return chemin,distance

"""
BELLMAN --------------------------------------------
"""
def bellman(poids, som_dep, som_arr):
    """
    Détermine les chemins de poids minimum,
    en relâchant tous les arcs n-1 fois.
    Si aucun changement la recherche s'arrête.
    La fonction détecte les circuits absorbant,

    Parameters
    ----------
    poids : Matrice des poids
    som_dep : Nom du sommet de départ
    som_arr: Nom du sommet d'arrivée'

    Returns
    -------
    chemin : Liste des noms des sommets composant
            le plus court chemin
    distance : Distance du plus court chemin
    """
    # Initialisation
    n = len(poids)
    dist = [float("inf")]*n
    pred = [None]*n
    s = indice_sommet(som_dep)
    dist[s] = 0
    ensembleDesArcs=[]
    k=1
    presenceCircuitAbsorbant = False
    for i in range(n):
        for j in range(n):
            if (poids[i][j] != float('inf')) & (i != j):
                ensembleDesArcs.append((i,j))
    # Traitement
    startTime = time.time() # Déclenchement du timer
    
    while k <= n :
        countChangement = 0
        changement = False
        for arc in ensembleDesArcs:
            changement = relacherArc(arc[0], arc[1], poids, dist, pred)
            if changement == True:
                countChangement = countChangement + 1
        if countChangement == 0:
            # Aucun changement donc
            # Arrêt de la boucle
            k = n + 1
        elif (countChangement != 0) & (k == n):
            print("chang")
            # Détection circuit absorbant
            presenceCircuitAbsorbant = True
            k = k + 1
        else:
            k = k + 1
            
    endTime = time.time() # Arrêt du timer
    
    if presenceCircuitAbsorbant == True:
        print('Pas de solution _ Contient un circuit absorbant')
        return [],0
    resultChemin = plusCourtChemin(indice_sommet(som_dep), indice_sommet(som_arr), dist, pred)
    chemin = resultChemin[0]
    distance = resultChemin[1]
    print('Solution : \n - chemin : ' + str(chemin) + '\n - distance: ' + str(distance) + '\n - Temps exécution : ' + str(endTime - startTime))
    return chemin,distance

""" 
BELLMAN-FORD-KALABA ---------------------------------------
"""    
def bellmanFordKalaba(poids,som_dep,som_arr):
    """
    Fonctionne sur tout type de graphes,
    l'itération se fait sur la longueur
    des chemins.
    L'algorithme s'arrête lorsqu'il n'y a
    pas eu de modifications entre l'étape
    k et l'étape k+1.
    La fonction détecte les circuit absorbant.

    Parameters
    ----------
    poids : Matrice des poids
    som_dep : Nom du sommet de départ
    som_arr: Nom du sommet d'arrivée'

    Returns
    -------
    chemin : Liste des noms des sommets composant
            le plus court chemin
    distance : Distance du plus court chemin
    """
    # Initialisation
    n = len(poids) # Nombre de sommets
    dist = [float("inf")]*n
    pred = [None]*n
    s = indice_sommet(som_dep)
    dist[s] = 0
    k=1 # Longueur de chemins
    sommetEnCoursDeTraitement=[s]
    presenceCircuitAbsorbant = False
    # Traitement
    startTime = time.time() # Déclenchement du timer
    
    while k <= n :
        sommetATraiter=[]
        for i in range(len(sommetEnCoursDeTraitement)):
        for val in listSucc(poids, sommetEnCoursDeTraitement[i]):
            if relacherArc(sommetEnCoursDeTraitement[i], val, poids, dist, pred) == True:
                if val not in sommetATraiter:
                    sommetATraiter.append(val)
        sommetEnCoursDeTraitement = sommetATraiter
        if len(sommetEnCoursDeTraitement) == 0:
            # Si pas de changement entre
            # étape k et k+1, arrêt de la boucle
            k = n + 1
        elif (len(sommetEnCoursDeTraitement) != 0) & (k == n):
            # Détection circuit absorbant
            presenceCircuitAbsorbant = True
            k = n + 1
        else:
            k = k+1 
            
    endTime = time.time() # Arrêt du timer
    
    if presenceCircuitAbsorbant == True:
        print('Pas de solution _ Contient un circuit absorbant')
        return [],0
    resultChemin = plusCourtChemin(indice_sommet(som_dep), indice_sommet(som_arr), dist, pred)
    chemin = resultChemin[0]
    distance = resultChemin[1]
    print('Solution : \n - chemin : ' + str(chemin) + '\n - distance: ' + str(distance) + '\n - Temps exécution : ' + str(endTime - startTime))
    return chemin,distance
        
"""
FLOYD-WARSHALL ----------------------------------------
"""
def matricesfloydWarshall(poids):
    """
    Permet de définir à partir de la 
    matrice M_0 "poids" la matrice des poids
    M_k et la matrice des prédécesseurs P_k.
    Détecte les circuits absorbants.
    
    Parameters
    ----------
    poids : Matrice des poids initiale

    Returns
    -------
    poids : Matrice des poids des chemins
            chemins minimums, si pas de circuit absorbant
            sinon []
    matricePred: Matrice des prédécesseurs dans
                les chemins minimums, si pas de circuit
                absorbant, sinon []
    """
    # Initialisation
    n = len(poids) 
    matricePred=[[None for i in range(n)]for i in range(n)]
    presenceCircuitAbsorbant = False 
    
    for i in range(n):
        for j in range(n):
            if (poids[i][j] != 0) & (poids[i][j] != float('inf')):
                    matricePred[i][j] = i
        
    # Traitements
    startTime = time.time() # Déclenchement du timer
    
    k=0     
    while k < n:
        i=0
        while i < n:
            j=0
            while j < n:
                if poids[i][k] + poids[k][j] < poids[i][j]:
                    poids[i][j] = poids[i][k] + poids[k][j]
                    matricePred[i][j] = matricePred[k][j]
                if (i == j) & (poids[i][j] < 0):
                    presenceCircuitAbsorbant = True
                    break
                j = j + 1
            if presenceCircuitAbsorbant:
                break
            i = i + 1
        if presenceCircuitAbsorbant:
            break
        k = k + 1
        
    endTime = time.time() # Arrêt du timer
    
    if presenceCircuitAbsorbant:
        poids = []
        matricePred = []
    print('Temps exécution : ' + str(endTime - startTime))
    return matricePred,str(endTime - startTime)


def floydWarshall(poids,matricePred,som_dep,som_arr):
    """
    Permet d'obtenir le plus court chemin entre
    deux sommet à partir des deux matrices
    préalablement calculées par la fonction
    "matriceFloydWarshal()"

    Parameters
    ----------
    poids : Matrice des poids
    matricePred : Matrice des prédécesseurs
    som_dep : Nom du sommet de départ
    som_arr : Nom du sommet d'arrivée

    Returns
    -------
    chemin : Liste des noms des sommets composant
            le plus court chemin
    distance : Distance du plus court chemin 
    """
    
    if len(poids) == 0 & len(matricePred) == 0:
        print('Pas de solution _ Contient un circuit absorbant')
        return [],0
    resultChemin = plusCourtCheminMatrice(indice_sommet(som_dep), indice_sommet(som_arr),
                                        poids, matricePred)
    chemin = resultChemin[0]
    distance = resultChemin[1]
    print('Solution : \n - chemin : ' + str(chemin) + '\n - distance: ' + str(distance))
    return chemin,distance

"""
ALGORITHME A* --------------------------------------------
"""
#########################################################
# calcul de la  distance entre deux points A et B dont  #
# on connait la lattitude et la longitude               #
#########################################################
def distanceGPS(latA,latB,longA,longB):
    # Conversions des latitudes en radians
    ltA=latA/180*pi
    ltB=latB/180*pi
    loA=longA/180*pi
    loB=longB/180*pi
    # Rayon de la terre en mètres 
    RT = 6378137
    # angle en radians entre les 2 points
    S = acos(round(sin(ltA)*sin(ltB) + cos(ltA)*cos(ltB)*cos(abs(loB-loA)),14))
    # distance entre les 2 points, comptée sur un arc de grand cercle
    return S*RT

# Permet de calculer la distanceGPS (à vol d'oiseau) entre 
# deux sommets
def heuristique(som_A,som_B):
    return distanceGPS(notreListePoints[som_A][1], notreListePoints[som_B][1],
                    notreListePoints[som_A][0], notreListePoints[som_B][0])

# Extrait le sommet qui possède le plus petit coût
# soit sa distance "dist" + sa distanceGPS jusqu'à 
# l'arrivée
def extract_minH(list_som,dist,heu):
    n = len(list_som)
    val = float('inf')
    s = 0
    # Traitements
    for i in range(n):
        if dist[list_som[i]] + heu[list_som[i]] < val:
            val = dist[list_som[i]] + heu[list_som[i]]
            s = i
    return list_som.pop(s)

def aStar(poids, som_dep, som_arr):
    # Initialisation
    n = len(poids)
    
    dist = [float("inf")]*n
    pred = {}
    s = indice_sommet(som_dep)
    L = [i for i in range(n)]
    dist[s] = 0
    pred[s] = None
    heu = []
    V = []
    
    # Calcul des heuristiques
    for key in notreListePoints:
        heu.append(heuristique(key, som_arr))
        
    startTime = time.time() # Déclenchement du timer
    while True:
        if L == []:
            break

        if indice_sommet(som_arr) in V:
            break
        # L'extraction se fait en tenant compte 
        # de l'heuristique des sommets
        s = extract_minH(L,dist,heu)
        
        for val in listSucc(poids,s):
            # On vérifie que le successeur n'a pas était
            # visité
            if val not in V:
                if dist[s] + poids[s][val] < dist[val]:
                    dist[val] = dist[s] + poids[s][val]
                    pred[val] = s
                
        V.append(s)       
                
    endTime = time.time() # Arrêt du timer
    
    resultChemin = plusCourtChemin(indice_sommet(som_dep), indice_sommet(som_arr), dist, pred)
    chemin = resultChemin[0]
    distance = resultChemin[1]
    print('Solution : \n - chemin : ' + str(chemin) + '\n - distance: ' + str(distance) + '\n - Temps exécution : ' + str(endTime - startTime))
    return chemin,distance