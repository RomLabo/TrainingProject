#include "diaporama.h"

Diaporama::Diaporama()
{
    _posImageCourante = 0;
}

Diaporama::~Diaporama()
{

}

void Diaporama::ajouterImage(int rang, string famille, string titre, string uri)
{
    Image* imageACharger;
    imageACharger = new Image(rang, famille, titre, uri);
    _diaporama.push_back(imageACharger);
}

void Diaporama::avancerImageCourante()
{
    _posImageCourante = _posImageCourante == nbImages()-1 ? 0 : _posImageCourante +1;
}

void Diaporama::reculerImageCourante()
{
    _posImageCourante = _posImageCourante == 0 ? nbImages()-1 : _posImageCourante -1;
}

unsigned int Diaporama::positionDuMax(unsigned int deb, unsigned int fin)
{
    unsigned int posMax = deb;
    for (unsigned int i=deb+1; i <= fin; i++)
    {
        if (_diaporama[i]->getRang() > _diaporama[posMax]->getRang())
        {
            posMax = i;
        }
    }
    return posMax;
}

void Diaporama::triDiaporama()
{
    unsigned int pos;
    Image* valAux;
    for (unsigned int i=nbImages()-1; i>0; i--)
    {
        pos = (*this).positionDuMax(0,i);
        valAux = _diaporama[pos];
        _diaporama[pos] = _diaporama[i];
        _diaporama[i] = valAux;
    }
}

void Diaporama::viderDiaporama()
{
    if (nbImages () > 0)
    {
        unsigned int taille = nbImages();
        for (unsigned int i = 0; i < taille ; i++)
        {
            _diaporama.pop_back(); /* Removes the last element in the vector,
                                      effectively reducing the container size by one.
                                      AND deletes the removed element */
        }
     _posImageCourante = 0;
    }
}

unsigned int Diaporama::nbImages()
{
    return _diaporama.size();
}

Image *Diaporama::imageCourante()
{
    return _diaporama[_posImageCourante];
}

