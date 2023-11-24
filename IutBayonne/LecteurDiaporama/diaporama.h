#ifndef DIAPORAMA_H
#define DIAPORAMA_H
#include "image.h"
#include <vector>
#include <QString>

typedef vector<Image*> TableauImages;   // Structure de données contenant les infos sur les images

class Diaporama
{
public:
    Diaporama();
    ~Diaporama();
    void ajouterImage(int rang=0, string famille="", string titre="", string uri=""); // ajoute une image dans le tableau d'images _diaporama
    unsigned int nbImages();    // affiche la taille de _diaporama
    Image* imageCourante();     // retourne le pointeur vers l'image courante
    void triDiaporama(); // trie le diaporama dans l'ordre croissant selon le rang de l'image
    void avancerImageCourante(); // incrémente l'index dans le vector
    void reculerImageCourante(); // décrémente l'index dans le vector
    void viderDiaporama();      // vide _diaporama de tous ses objets image et les delete

private:
    TableauImages _diaporama;
    unsigned int _posImageCourante;  /* position, dans le diaporama,
                                        de l'image courante.
                                        Indéfini quand diaporama vide.
                                        Démarre à 0 quand diaporama non vide */

private:
    unsigned int positionDuMax(unsigned int, unsigned int); // retourne l'index dans le vecteur de l'image ayant le rang le plus grand
};

#endif // DIAPORAMA_H
