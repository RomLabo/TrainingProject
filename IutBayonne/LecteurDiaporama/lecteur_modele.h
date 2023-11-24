#ifndef LECTEUR_MODELE_H
#define LECTEUR_MODELE_H

#include "database.h"
#include "diaporama.h"



class LecteurModele
{
public:
    LecteurModele();
    void avancer();             // incrémente _posImageCourante, modulo nbImages()
    void reculer();             // décrémente _posImageCourante, modulo nbImages()
    void changerDiaporama(unsigned int pNumDiaporama);    // permet de choisir un diaporama, 0 si aucun diaporama souhaité
    unsigned int nbImages();    // affiche la taille de _diaporama
    Image* imageCourante();     // retourne le pointeur vers l'image courante
    unsigned int numDiaporamaCourant();
    QStringList getNomDiapo(); // Retourne le noms des diaporama
    void modifierTitreImage(QString); // Modifie le titre de l'image courante

private:
    Database *_dataBase; // La base de donnée contenant les informations des images
    unsigned _numDiaporamaCourant;   // numéro du diaporama courant, par défaut 0
    Diaporama _diaporama;            // Le diaporama contenant les images récupérées en base de données
private:
    void chargerDiaporama();    // charge dans _diaporama les images du _numDiaporamaCourant
};

#endif // LECTEUR_MODELE_H
