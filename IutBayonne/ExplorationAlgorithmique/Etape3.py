# -*- coding: utf-8 -*-
"""
SAE 2.02 EXPLORATION ALGORITHMIQUE D'UN PROBLEME
Created on Thu Mar 30 09:39:11 2023
@author: Kessentini_Nour & Laborde_Romain
Etape 3 : 
"""

""" 
A. Lecture des données externes
"""

from math import *
import pandas as pd
import numpy as np
import os 
os.chdir('F:/courBut/semestre2/s202/etape3Finale')
os.getcwd()

from algorithmes import *
    
"""
Conversion coordonées GPS vers pixels ------------------------------
"""

# Fonction de conversion utilisant la projection Mercator
""" Dans le programme nous n'utilisons pas cette fonction 
    car nous n'avons pas réussi à placer tout les points dans
    la zone de dessin, cependant nous l'avons testée et comparer
    sur google earth avec des points identiques et nous obtenons
    bien la même représentation graphique.

minLatEnDegree = minLat * pi / 180
def coordGpsToPixel2(long_x, lat_x):
    coord_x = ((long_x - minLong)*(892 / deltaMaxMinLong))
    
    lat = lat_x * pi / 180
    largeurCarte = ((892 / deltaMaxMinLong) * 360) / (2 * pi)
    decalageY = (largeurCarte / 2 * log((1 + sin(minLatEnDegree)) / (1 - sin(minLatEnDegree))))
    coord_y = (892 - ((largeurCarte / 2 * log((1 + sin(lat)) / (1 - sin(lat)))) - decalageY))
    return coord_x,coord_y

"""
    
# Notre fonction de conversion
""" Notre fonction ne permet pas une bonne projection """
def coordGpsToPixel(long_x,lat_x):
    coord_x = ((long_x - minLong)*(880 / deltaMaxMinLong))
    coord_y = (((maxLat - lat_x)*880)/deltaMaxMinLat) 
    return coord_x,coord_y

notreListePoints2 = {}
# Convertion des coordonées GPS en pixels
for key in notreListePoints:
    coord = coordGpsToPixel(notreListePoints[key][0], notreListePoints[key][1])
    notreListePoints2[key] = [coord[0],coord[1]]
    
# Liste d'adjacence
def listAdj(matricePoids):
    list_adj = {}
    n = len(matricePoids)
    for i in range(n):
        list_adj[nom_sommet(i)] = []
        for j in range(n):
            if (matricePoids[i][j] != 0) & (matricePoids[i][j] != float('inf')):
                list_adj[nom_sommet(i)].append(nom_sommet(j))
    return list_adj            

notreListeAdjacence = listAdj(notreMatricePoids)

"""
Création des éléments graphiques -----------------------------
"""
def creationLignesArcs(list_adj, liste_point):
    # Permet de créer un tableau de lignes 
    # représentant les arcs du graph
    lignesArcs = []
    n = len(list_adj)
    for key in list_adj:
        point1 = Point(liste_point[key][0]+10,liste_point[key][1]+10)
        for i in range(len(list_adj[key])):
            point2 = Point(liste_point[list_adj[key][i]][0]+10,
                        liste_point[list_adj[key][i]][1]+10)
            lignesArcs.append(Line(point1,point2))
    return lignesArcs        

def creationSymbolesPoints(list_point, som_dep, som_arr):
    # Permet de créer des symboles graphiques
    # représentant le point de départ et arrivée
    symbolesPoints = []
    pointDep1 = Circle(Point(list_point[som_dep][0]+10,list_point[som_dep][1]+10),10)
    pointDep1.setFill("grey")
    symbolesPoints.append(pointDep1)
    pointDep2 = Circle(Point(list_point[som_dep][0]+10,list_point[som_dep][1]+10),4)
    pointDep2.setFill("white")
    pointDep2.setOutline("red")
    pointDep2.setWidth(3)
    symbolesPoints.append(pointDep2)
    
    pointArr = Circle(Point(list_point[som_arr][0]+10,list_point[som_arr][1]+10),4)
    pointArr.setFill("white")
    pointArr.setOutline("red")
    pointArr.setWidth(3)
    symbolesPoints.append(pointArr)
    
    c1 = list_point[som_arr][0]
    c2 = list_point[som_arr][1]-18
    pointSymbole = Circle(Point(c1+10,c2+10),10)
    pointSymbole.setFill("grey")
    pointSymbole1 = Polygon(Point(c1,c2+14),Point(c1+20,c2+14),Point(c1+10,c2+28))
    pointSymbole1.setFill("grey")
    symbolesPoints.append(pointSymbole1)
    symbolesPoints.append(pointSymbole)
    return symbolesPoints

def creationPoints(list_point):
    # Permet de créer une liste de points
    # représentant les sommets du graph
    listePoints = []
    for key in list_point:
        listePoints.append(Circle(Point(list_point[key][0]+10,list_point[key][1]+10),4))
    return listePoints

def creationLignesChemin(chemin, list_point):
    # Permet de créer les lignes qui constitueront le 
    # tracé du chemin.
    lignesChemin = []
    for i in range(len(chemin[0])-1):
        point1 = Point(list_point[chemin[0][i]][0]+7,list_point[chemin[0][i]][1]+7)
        point2 = Point(list_point[chemin[0][i+1]][0]+7,list_point[chemin[0][i+1]][1]+7)
        line = Line(point1, point2)
        line.setFill("red")
        line.setWidth(3)
        lignesChemin.append(line)
    return lignesChemin
    
"""
Dessin éléments graphiques --------------------------
""" 
def dessinerElementsGraphiques(window, list_elm, tempo = 0):
    # Permet de dessiner les éléments graphiques
    # de "list_elm" dans la fenêtre "window" avec
    # en option une temporisation entre chaque dessin
    for elm in list_elm:
        elm.draw(window)
        time.sleep(tempo)
    return 0
    
def effacerElementsGraphiques(list_elm):
    # Permet d'éffacer les éléments graphiques
    # de list_elm
    for elm in list_elm:
        elm.undraw()
    return 0
    
"""
Menu de saisi des sommets ------------------------------- 
"""
def menuSaisi(win):
    # Elements graphiques du menu de saisi
    interfaceElements = {'encadrementMenu':Rectangle(Point(70,50),Point(210,210)),
                        'encadrementBtn':Rectangle(Point(120,180), Point(200,200)),
                        'input1':Entry(Point(170,90),5),
                        'input2':Entry(Point(170,110),5),
                        'label1':Text(Point(120,70),"Chemin - "),
                        'label2':Text(Point(120,90),"De : "),
                        'label3':Text(Point(120,110),"Vers : "),
                        'label4':Text(Point(120,140),"min: S_1"),
                        'label5':Text(Point(135,160),"max: S_1766"),
                        'label6':Text(Point(150,190),"Valider")}
    
    interfaceElements['encadrementMenu'].setFill("white")
    interfaceElements['encadrementBtn'].setFill("green")
    # Dessin des éléments graphiques
    for elm in interfaceElements:
        interfaceElements[elm].draw(win)
    # Coordonnées coin supérieur gauche bouton et
    # coordonnées coin inférieur droite bouton
    x1 = 120
    x2 = 200
    y1 = 180
    y2 = 200
    # Récupération position du click de l'utilisateur 
    while True:
        clickPoint = win.getMouse()
        clickPointX = clickPoint.getX()
        clickPointY = clickPoint.getY()
        if ((clickPointX >= x1)&(clickPointX <= x2)) & ((clickPointY >= y1)&(clickPointY <= y2)):
            break;
    # Enregistrement des valeurs saisies par l'utilisateur    
    som_dep = interfaceElements['input1'].getText()
    som_arr = interfaceElements['input2'].getText()
    
    # Effacement des éléments graphiques
    for elm in interfaceElements:
        interfaceElements[elm].undraw()
    
    interfaceElements['input1'].setText("")
    interfaceElements['input2'].setText("")
    
    return som_dep,som_arr

"""
Application principale -------------------------------- 
"""
def app(list_adj, list_point, poids, idAlgo, parcoursAvecDessin):
    img = Image(Point(450,450),"carte.gif")
    
    win = GraphWin("Sae 2.02 Etape 3", 900,900)
    img.draw(win)
    
    # Dessin des points (sommets) du graph
    listePoints = creationPoints(list_point)
    dessinerElementsGraphiques(win, listePoints)
    
    # Dessin des lignes (arcs) du graph
    lignesArcs = creationLignesArcs(list_adj, list_point)
    dessinerElementsGraphiques(win, lignesArcs)
    time.sleep(0.1)
    
    # Affichage du menu et récupération des sommets choisis
    choix = menuSaisi(win)
    
    # Affichage du message résumant les choix de l'utilisateur
    sousTitre = Text(Point(120,10),"chemin de " + choix[0] + " à "+choix[1])
    sousTitre.draw(win)
    
    # Dessin des symboles représentant le point de départ
    # et le point d'arrivée du chemin
    symboles = creationSymbolesPoints(list_point, choix[0], choix[1])
    dessinerElementsGraphiques(win, symboles)
    time.sleep(0.4)
    
    # Calcul et dessin du chemin le plus court
    if idAlgo == 'A':
        chemin = aStar(win, list_point, poids, choix[0], choix[1], parcoursAvecDessin) 
    elif idAlgo == 'B':
        chemin = dijkstra(win, list_point, poids, choix[0], choix[1], parcoursAvecDessin)
    elif idAlgo == 'C':
        chemin = bellman(win, list_point, poids, choix[0], choix[1], parcoursAvecDessin)
    elif idAlgo == 'D':
        chemin = bellmanFordKalaba(win, list_point, poids, choix[0], choix[1], parcoursAvecDessin)
    elif idAlgo == 'E':
        matricePred = matricesfloydWarshall(win, list_point, poids, True)[0]
        chemin = floydWarshall(poids, matricePred, choix[0], choix[1])
    
    # Dessin des lignes composant le plus court chemin
    lignesChemin = creationLignesChemin(chemin, list_point)
    dessinerElementsGraphiques(win, lignesChemin, 0.03)
    
    win.getMouse()
    win.close()
    
""" 
Pour sélectionner l'algorithme à utiliser :
    A : aStar
    B : dijkstra
    C : bellman
    D : bellmanFordKalaba
    E : floydWarshall 
Pour voir le dessin du parcours de l'algo 
ajouter True en dernier paramètre.
"""
    
app(notreListeAdjacence,notreListePoints2,notreMatricePoids,'A',True)