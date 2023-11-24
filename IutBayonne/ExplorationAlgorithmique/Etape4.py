# -*- coding: utf-8 -*-
"""
SAE 2.02 EXPLORATION ALGORITHMIQUE D'UN PROBLEME
Created on Thu Mar 30 09:39:11 2023
@author: Kessentini_Nour & Laborde_Romain
Etape 4 : Prise en main des données, importation, préparation
"""
from math import *
import time
import pandas as pd
import numpy as np
import os 
os.chdir('F:/courBut/semestre2/s202/etape4')
os.getcwd()

"""
CLASSE SOMMET -------------------------------------
"""
class Sommet:
    def __init__(self,nom,coordGps):
        self._nom = nom
        self._coordsGps = self.strCoordGps(coordGps) 
        self._pred = None
        self._dist = float('inf')
    @property 
    def nom(self):
        return self._nom
    @property 
    def latitude(self):
        return float(self._coordsGps[1])
    @property 
    def longitude(self):
        return float(self._coordsGps[0])
    """ Retourne le prédecesseur """
    @property
    def pred(self):
        return self._pred 
    """ Affecte un prédécesseur """
    @pred.setter 
    def pred(self,predecesseur):
        self._pred = predecesseur
    """ Retourne la distance du sommet """
    @property
    def dist(self):
        return self._dist
    """ Affecte une distance au sommet """
    @dist.setter
    def dist(self,distance):
        self._dist = distance
    """ A partir de l'indice du sommet 
        dans la matrice d'adjacence, 
        retourne son nom """
    def nom_som(indice_sommet):
        return "S_" + str(indice_sommet+1)
    """ A partir du nom du sommet 
        retourne son indice dans la 
        matrice d'adjacence """
    def indice_som(nom_sommet):
        return int(nom_sommet.split("_")[1])-1
    """ Sépare la chaine de caractère 
        comportant la latitude et longitude
        en un tableau de deux chaines
        distinctes """
    def strCoordGps(self,strCoordGps):
        coordsGps = strCoordGps.split(',')
        return coordsGps
    
"""
CLASSE ARC -----------------------------------------
"""
class Arc:
    def __init__(self,sommet1,sommet2):
        self._som1 = sommet1
        self._som2 = sommet2
        self._poids = float('inf')
    """ Retourne le sommet de départ
        de l'arc """    
    @property 
    def som1(self):
        return self._som1
    """ Affecte un sommet de départ """
    @som1.setter 
    def som1(self,sommet):
        self._som1 = sommet 
    """ Retourne le sommet d'arrivée
        de l'arc """
    @property 
    def som2(self):
        return self._som2
    """ Affecte un sommet d'arrivée """
    @som2.setter 
    def som2(self,sommet):
        self._som2 = sommet
    """ Retourne le poids de l'arc """
    @property 
    def poids(self):
        return self._poids
    """ Affecte le poids de l'arc """
    @poids.setter 
    def poids(self, p):
        self._poids = p 
                
"""
CLASSE GRAPH -------------------------------------------
"""
class Graph:
    def __init__(self):
        self._ensembleArc = []
        self._ensembleSommet = []
    def ajouterArc(self,arc):
        return self._ensembleArc.append(arc)
    def ajouterSommet(self,sommet):
        return self._ensembleSommet.append(sommet)
    def dijkstra(self,nom_som_dep,nom_som_arr):
        """ A Faire """
        return 0
    def bellmanFordKalaba(self,nom_som_dep,nom_som_arr):
        """ A Faire """
        return 0
    def aStar(self,nom_som_dep,nom_som_arr):
        """ A Faire """
        return 0
    def floydWarshall(self,nom_som_dep,nom_som_arr):
        """A  Faire """
        return 0
    def bellman(self,nom_som_dep,nom_som_arr):
        L={}
        k=1
        n = len(self._ensembleArc)
        for sommet in self._ensembleSommet:
            if sommet.nom == nom_som_dep:
                sommet.dist = 0
        # Traitement
        while k < n :
            changement = False
            for arc in self._ensembleArc:
                if arc.som1.nom not in L:
                    L[arc.som1.nom] = arc.som1
                if arc.som2.nom not in L:
                    L[arc.som2.nom] = arc.som2
                
                if L[arc.som1.nom].dist + arc.poids < L[arc.som2.nom].dist:
                    changement = True
                    L[arc.som2.nom].dist = L[arc.som1.nom].dist + arc.poids
                    L[arc.som2.nom].pred = arc.som1.nom
            if changement == False:
                k = n
            else:
                k = k + 1
        
        v = nom_som_arr
        chm=[v]
        
        while v != nom_som_dep:
            v = L[v].pred
            chm.insert(0, v)
        return chm
            
"""
IMPORTATION LISTE DE POINTS ET MATRICE POIDS ----------------------------
"""        
# Création dataframe "notre_liste_points" pour calculer l'heuristique
notre_liste_points=pd.read_table('notreListePoints.csv', sep=',', index_col='Unnamed: 0',
                        encoding='latin_1')

# Importation de notre matrice de poids obtenue à l'étape 1
notre_mat_poids=pd.read_table('notreMatricePoids.csv', sep=',', index_col='Unnamed: 0',
                            encoding='latin_1')

notreMatricePoids=notre_mat_poids.values.tolist() 

# Transformation dataframe "notre_liste_points" en dictionnaire
# préparation des données pour calculer notre heuristique
graphe = Graph()
def ajoutDesSommets():
    for index,row in notre_liste_points.iterrows():
        graphe.ajouterSommet(Sommet(row[1],row[0]))
            
def ajoutDesArcs():
    for i in range(len(notreMatricePoids)):
        for j in range(len(notreMatricePoids)):
            if (notreMatricePoids[i][j] != float('inf')) & (notreMatricePoids[i][j] != 0):
                graphe.ajouterArc(Arc(graphe._ensembleSommet[i],graphe._ensembleSommet[j]))
                graphe._ensembleArc[i].poids = notreMatricePoids[i][j]

ajoutDesSommets()
ajoutDesArcs()
            
""" La méthode bellman ne fonctionne pas correctement
    pour les points passer en paramètre tout fonctionne
    cependant sur d'autre points nous rencontrons une 
    erreur dans l'exécution """
print(graphe.bellman('S_5', 'S_12'))