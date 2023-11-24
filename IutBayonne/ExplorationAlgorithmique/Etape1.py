# -*- coding: utf-8 -*-
"""
SAE 2.02 EXPLORATION ALGORITHMIQUE D'UN PROBLEME
Created on Thu Mar 30 09:39:11 2023
@author: Kessentini_Nour & Laborde_Romain
Etape 1 : Prise en main des données, importation, préparation
"""

""" 
A. Lecture des données externes
"""
from math import *
import pandas as pd
import numpy as np
import os 
os.chdir('F:/courBut/semestre2/s202')
os.getcwd()

# Création du dataFrame itineraire avec le fichier 'fichier-itineraires-randonnee.csv'
itineraire=pd.read_table('fichier-itineraires-randonnee.csv', sep=';', index_col='id_local',
                            encoding='latin_1')

""" 
B. Nettoyage
"""
""" 1. Valeurs manquantes """
# Récapitulatif du nombre de valeurs manquantes par variables
itineraire.isnull().sum()
# Filtrage des lignes ayant un index null
itineraire=itineraire.loc[itineraire.index.isnull() == False,:]
# Filtrage des lignes n'ayant pas de point de départ
# ou pas de point d'arrivée ou pas de tracé
itineraire=itineraire.loc[(itineraire['depart '].isnull() == False)
                            &(itineraire['arrivée'].isnull() == False)
                            &(itineraire['tracé'].isnull() == False),:]

""" 2. Vérification des distances """
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

# a. Calcul de la distance
trace=itineraire['tracé'].to_numpy()
distance=[0 for i in range(len(trace))]
# Conversion des chaine de caractère en float
for i in range(len(trace)):
    trace[i]=trace[i].split(',')
for i in range(len(trace)):
    for j in range(len(trace[i])):
        trace[i][j]=float(trace[i][j])
# Calcul de la distance pour chaque tracé 
for i in range(len(trace)):
        for j in range(0,len(trace[i]),2):
            if j+3 <= len(trace[i]):
                distance[i] += distanceGPS(trace[i][j+1], trace[i][j+3],
                                            trace[i][j], trace[i][j+2])


itineraire['distance']=distance

# b. Comparaison de distance et longueur
ecart=[]
for index, row in itineraire.iterrows():
    ecart.append(row['distance']-row['longueur'])
itineraire['ecart']=ecart

""" 
C. Les points de départ et arrivée 
"""
""" 1. Inventaire des points de départ et 
        d'arrivée utilisés dans les itinéraires """
# Copie des points de départ du dataFrame itineraire
departAvecDouble=itineraire.loc[:,['depart ']]
# Copie des points d'arrivée du dataFrame itineraire
arriveeAvecDouble=itineraire.loc[:,['arrivée']]

# Création d'une liste de l'ensemble des points
listeEnsemblePoints=[]
for i in range(len(departAvecDouble)):
    listeEnsemblePoints.append(departAvecDouble.iloc[i][0])
for i in range(len(arriveeAvecDouble)):
    listeEnsemblePoints.append(arriveeAvecDouble.iloc[i][0])
# Création d'une serie avec la liste de l'ensemble des points
serieEnsemblePoints=pd.Series(listeEnsemblePoints)
# Suppression des points en double
serieEnsemblePoints.drop_duplicates(keep='first',inplace=True)
# Conversion de la serie en dataFrame
serieEnsemblePoints=serieEnsemblePoints.to_frame()


""" Réunion de deux sommets d'une 
    distance inférieur ou égale à 2 mètres """
    
# Copie des coordonnées des sommets
coordonnees=[]
for i in range(len(serieEnsemblePoints)):
    coordonnees.append(serieEnsemblePoints.iloc[i,0])
# Passage de coordonnée sous forme de chaine de caractère
# à des coordonnée sous forme de réels
for i in range(len(coordonnees)):
    coordonnees[i]=coordonnees[i].split(',')
    coordonnees[i][0]=float(coordonnees[i][0])
    coordonnees[i][1]=float(coordonnees[i][1])
# Calcul des distances GPS entre chaque sommet
# Si inférieur à 2 mètres
# Passage des coordonnées en chaine de caractère
# Ajout coordonnées qui doivent être supprimées et coordonnées à garder
# Modification des coordonnées dans serieEnsemblePoints
coordonneesAModifier=[]
for i in range(len(coordonnees)):
    for j in range(i+1,len(coordonnees)):
        if distanceGPS(coordonnees[i][1], coordonnees[j][1], coordonnees[i][0], coordonnees[j][0]) <= 2:
            coordonneeAGarder=",".join(str(n) for n in coordonnees[i])
            coordonneeASupprimer=",".join(str(n) for n in coordonnees[j])
            coordonneesAModifier.append([coordonneeASupprimer,coordonneeAGarder])
            serieEnsemblePoints.loc[serieEnsemblePoints[0]==coordonneeASupprimer,0]=coordonneeAGarder
# Suppression des doublons dans l'ensemble des points    
serieEnsemblePoints.drop_duplicates(keep='first',inplace=True)
# Modification des coordonnées dans itineraire 
for i in range(len(coordonneesAModifier)):
    itineraire.loc[itineraire['depart ']==coordonneesAModifier[i][0],'depart ']=coordonneesAModifier[i][1]
    itineraire.loc[itineraire['arrivée']==coordonneesAModifier[i][0],'arrivée']=coordonneesAModifier[i][1]
    
""" Suie -> 1. Inventaire des points de départ et 
        d'arrivée utilisés dans les itinéraires """
    
# Création d'une liste contenant les noms des sommets
nomSommet=["S_" + str(i+1) for i in range(len(serieEnsemblePoints))]
# Ajout d'une variable 'nom_sommet' avec la liste des noms
serieEnsemblePoints['nom_Sommet']=nomSommet
# Renommage des variables
serieEnsemblePoints.rename(columns={0:'latitude_longitude', 'nom_Sommet':'nom_sommet'},inplace=True)


""" 2. Ajout des noms des points dans itineraire """
# Ajout des noms de départ dans itineraire en joingnant serieEnsemblePoints
itineraire=itineraire.join(serieEnsemblePoints.set_index('latitude_longitude'),on='depart ')
# Renommage de la variable ajoutée
l=list(itineraire.columns)
l[18]='nom_dep'
itineraire.columns=l
# Ajout des noms d'arrivée dans itineraire en joignant serieEnsemblePoints
itineraire=itineraire.join(serieEnsemblePoints.set_index('latitude_longitude'),on='arrivée')
# Renommage de la variable ajoutée
l=list(itineraire.columns)
l[19]='nom_arr'
itineraire.columns=l


"""
D. Le graphe 
"""
""" 1. Dictionnaire des voisins (successeurs) """
# Extraction des sommets de départ et de leur sommet d'arrivée
sommetDepartEtArrivee=itineraire.loc[:,['nom_dep','nom_arr']]
# Passage de dataframe à un tablea des sommets départ et arrivée
tableauSommetDepartEtArrivee=sommetDepartEtArrivee.to_numpy()
# Création d'un dictionnaire avec comme clé chaque nom de sommet
list_succ={}
list_succEtDist={}
for i in range(len(serieEnsemblePoints)):
    list_succ["S_" + str(i+1)]=[]
    list_succEtDist["S_" + str(i+1)]=[]
# Ajout des successeurs à chaque sommet du dictionnaire
for i in range(len(tableauSommetDepartEtArrivee)):
    list_succ[tableauSommetDepartEtArrivee[i][0]].append(tableauSommetDepartEtArrivee[i][1])
    list_succ[tableauSommetDepartEtArrivee[i][1]].append(tableauSommetDepartEtArrivee[i][0])
    
""" 2. Dictionnaire des voisins avec distances """
# Itération sur la liste des successeurs précédemment crée
# Ajout du successeur dans le tuple
# Extraction de la longueur entre le sommet de départ et successeur
# Ajout de la longueur (distance) dans le tuple
# puis ajout du tuple dans la liste 'list_succEtDist'
for key in list_succ:
    for i in range(len(list_succ[key])):
        list_succEtDist[key].append((list_succ[key][i],
            itineraire.loc[((itineraire['nom_dep']==key)|(itineraire['nom_arr']==key))&((itineraire['nom_arr']==list_succ[key][i])|(itineraire['nom_dep']==list_succ[key][i])),
                                'distance'].values[0]))
        
""" 3. Matrice des poids """
# Création de la matrice des poids et initialisation à infini
matricePoids=[[float('inf') for i in range(len(list_succ))] for i in range(len(list_succ))]
# Ajout d'un poids null pour les sommets allant à eux-même
for i in range(len(matricePoids)):
    for j in range(len(matricePoids)):
        if i == j :
            matricePoids[i][j]=0
            
# Permet d'associer le nom du sommet (point) à son indice dans matricePoids
def nom(indice):
    return "S_" + str(indice+1)
# Permet d'associer l'indice du sommet (point) à son nom, nompoint
def indice_som(nompoint):
    return int(nompoint.split("_")[1])-1

# Parcours de la list_succEtDist pour ajouter les distances 
# de chaque arc existant dans la matricePoids
for key in list_succEtDist:
    for i in range(len(list_succEtDist[key])):
        matricePoids[indice_som(key)][indice_som(list_succEtDist[key][i][0])]=list_succEtDist[key][i][1]
        


print(matricePoids[indice_som('S_2')][indice_som('S_3')])