#include "lecteur_modele.h"
#include <QSqlQuery>
#include <QSqlRecord>
#include <QSqlField>

LecteurModele::LecteurModele()
{
    _dataBase = new Database;
    Diaporama _diaporama;
}

void LecteurModele::avancer()
{
    _diaporama.avancerImageCourante();
}

void LecteurModele::reculer()
{
    _diaporama.reculerImageCourante();
}

void LecteurModele::changerDiaporama(unsigned int pNumDiaporama)
{
    // s'il y a un diaporama courant, le vider, puis charger le nouveau Diaporama
    if (_numDiaporamaCourant > 0)
    {
        _diaporama.viderDiaporama();
    }
    _numDiaporamaCourant = pNumDiaporama;
    if (_numDiaporamaCourant > 0)
    {
        chargerDiaporama(); // charge le diaporama courant
    }

}

QStringList LecteurModele::getNomDiapo()
{
    QSqlQuery query;
    QStringList nomsDiapo;
    query.exec("Select * From Diaporamas");
    for (int i=0; query.next(); i++)
    {
        nomsDiapo.append(query.value(1).toString());
    }
    return nomsDiapo;
}

void LecteurModele::modifierTitreImage(QString str)
{
    QSqlQuery query;
    string titreImg = _diaporama.imageCourante()->getTitre();
    QString titre = QString::fromStdString(titreImg);
    query.prepare("UPDATE Diapos SET titrePhoto = :D WHERE titrePhoto = :A");
    query.bindValue(":D",str);
    query.bindValue(":A",titre);
    query.exec();
}

void LecteurModele::chargerDiaporama()
{
    //Diaporama _diaporama(_numDiaporamaCourant, _nomDiaporamaCourant);
    QSqlQuery query;
    query.prepare("SELECT DDD.rang, Ds.titrePhoto, Ds.uriPhoto, F.nomFamille FROM DiaposDansDiaporama DDD JOIN Diaporamas Dps ON DDD.idDiaporama = Dps.idDiaporama JOIN Diapos Ds ON DDD.idDiapo = Ds.idphoto JOIN Familles F ON Ds.idFam = F.idFamille WHERE DDD.idDiaporama = :id");
    query.bindValue(":id", _numDiaporamaCourant);
    query.exec();
    for (int i = 0; query.next(); i++) {
        _diaporama.ajouterImage(query.value(0).toInt(),
                                query.value(3).toString().toStdString(),
                                query.value(1).toString().toStdString(),
                                ":"+query.value(2).toString().toStdString());
    }

     // trie du contenu du diaporama par ordre croissant selon le rang de l'image dans le diaporama
    _diaporama.triDiaporama();
}

unsigned int LecteurModele::nbImages()
{
    return _diaporama.nbImages();
}

Image *LecteurModele::imageCourante()
{
    return _diaporama.imageCourante();
}

unsigned int LecteurModele::numDiaporamaCourant()
{
    return _numDiaporamaCourant;
}
