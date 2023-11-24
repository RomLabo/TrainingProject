#include "lecteur_vue.h"
#include "ui_lecteur_vue.h"
#include <cstring>

LecteurVue::LecteurVue(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::LecteurVue)
{
    ui->setupUi(this);
    _scene = new QGraphicsScene(ui->imgVue);
    _message = new LecteurMessage(this);
    _vitesseDial = new LecteurVitesse(this);
    _choixDiapo = new LecteurChoixDiapo(this);
    _modifTitre = new LecteurModifIntitule(this);
    _modele = new LecteurModele;
    _item = new QGraphicsPixmapItem;
    _timer = new QTimer(this);
    _speed = 2000;
    ui->imgVue->setScene(_scene);

    setMode(QString(tr("Manuel")));
    ui->statusbar->showMessage(tr("mode : Manuel             images : 0"));
    ui->actionModifier_titre_image->setEnabled(false);
    desactiverToutBoutons();

    connect(ui->btnLancer,SIGNAL(clicked()),this,SLOT(demandeLancer()));
    connect(ui->btnArreter,SIGNAL(clicked()),this,SLOT(demandeArreter()));
    connect(ui->btnSuivant,SIGNAL(clicked()),this,SLOT(demandeSuivant()));
    connect(ui->btnPrecedent,SIGNAL(clicked()),this,SLOT(demandePrecedent()));

    connect(ui->btnSuivant,SIGNAL(clicked()),this,SLOT(demandeMajStatusBar()));
    connect(ui->btnPrecedent,SIGNAL(clicked()),this,SLOT(demandeMajStatusBar()));

    connect(ui->btnSuivant,SIGNAL(clicked()),this,SLOT(demandeMajIntitule()));
    connect(ui->btnPrecedent,SIGNAL(clicked()),this,SLOT(demandeMajIntitule()));

    connect(ui->action_Quitter,SIGNAL(triggered()),this,SLOT(demandeEnleverDiapo()));
    connect(ui->action_Quitter,SIGNAL(triggered()),QCoreApplication::instance(),SLOT(quit()));

    connect(ui->actionA_propos_de,SIGNAL(triggered()),_message,SLOT(exec()));
    connect(ui->actionVitesse,SIGNAL(triggered()),this,SLOT(demandeChangerVitesse()));
    connect(ui->actionCharger_diaporama,SIGNAL(triggered()),this,SLOT(demandeChargerDiapo()));
    connect(ui->actionEnlever_diaporama,SIGNAL(triggered()),this,SLOT(demandeEnleverDiapo()));
    connect(ui->actionMini_lecteur,SIGNAL(triggered()),this,SLOT(demandeMiniLecteur()));
    connect(ui->actionEnlever_diaporama,SIGNAL(triggered()),_timer,SLOT(stop()));

    connect(_timer,SIGNAL(timeout()),this,SLOT(demandeImageSuivante()));
    connect(_timer,SIGNAL(timeout()),this,SLOT(demandeMajIntitule()));
    connect(_timer,SIGNAL(timeout()),this,SLOT(demandeMajStatusBar()));

    connect(ui->actionModifier_titre_image,SIGNAL(triggered()),this,SLOT(demandeModifIntitule()));
}

void LecteurVue::chargerImage()
{
    if (_scene->items().isEmpty() == false)
    {
        _scene->removeItem(_item);
    }
    QImage imgActuelle(QString::fromStdString(_modele->imageCourante()->getChemin()));
    _item = new QGraphicsPixmapItem(QPixmap::fromImage(imgActuelle));
    _scene->addItem(_item);
}

void LecteurVue::demandeModifIntitule()
{
    int retour = _modifTitre->exec();
    if (retour && _scene->items().isEmpty() == false) {
        _modele->modifierTitreImage(_modifTitre->getValue());
    }
}

void LecteurVue::desactiverToutBoutons()
{
    ui->btnArreter->setEnabled(false);
    ui->btnLancer->setEnabled(false);
    ui->btnSuivant->setEnabled(false);
    ui->btnPrecedent->setEnabled(false);
}

void LecteurVue::demandeChargerDiapo()
{
    if (_currentNumDiapo == -1)
    {
        _choixDiapo->addItems(_modele->getNomDiapo());
        int retour = _choixDiapo->exec();
        if (retour == 1)
        {
            _currentNumDiapo = _choixDiapo->getValue();
            chargerDiapo();
            ui->actionCharger_diaporama->setEnabled(false);
        }
    }
}

void LecteurVue::chargerDiapo()
{
    _modele->changerDiaporama(_currentNumDiapo);
    chargerImage();
    ui->btnLancer->setEnabled(true);
    ui->btnPrecedent->setEnabled(true);
    ui->btnSuivant->setEnabled(true);
    ui->actionModifier_titre_image->setEnabled(true);
    demandeMajIntitule();
    demandeMajStatusBar();
}

void LecteurVue::demandeEnleverDiapo()
{
    _timer->stop();
    if (_scene->items().isEmpty() == false)
    {
        _scene->removeItem(_item);
    }
    desactiverToutBoutons();
    _modele->changerDiaporama(0);
    demandeMajIntitule();
    ui->statusbar->showMessage(tr("mode : Manuel             images : 0"));
    ui->actionCharger_diaporama->setEnabled(true);
    ui->actionVitesse->setEnabled(true);
    ui->actionModifier_titre_image->setEnabled(false);
    _currentNumDiapo = -1;
}

void LecteurVue::demandeChangerVitesse()
{
    int retour = _vitesseDial->exec();
    if (retour == 1)
    {
        _speed = _vitesseDial->getValue() * 100;
    }
}

void LecteurVue::demandeMiniLecteur()
{
    resize(minimumSize());
}

void LecteurVue::demandeImageSuivante()
{
    _modele->avancer();
    chargerImage();
}

void LecteurVue::demandeImagePrecedente()
{
    _modele->reculer();
    chargerImage();
}

void LecteurVue::demandeLancer()
{
    chargerDiapo();
    chargerImage();
    if (getMode() == QString(tr("Manuel")))
    {
        demandeMajMode();
    }
    demandeMajIntitule();
    demandeMajStatusBar();
    ui->btnArreter->setEnabled(true);
    ui->actionVitesse->setEnabled(false);
    ui->actionModifier_titre_image->setEnabled(false);
    _timer->start(_speed);
}

void LecteurVue::demandeArreter()
{
    ui->btnArreter->setEnabled(false);
    ui->actionCharger_diaporama->setEnabled(true);
    ui->actionVitesse->setEnabled(true);
    ui->actionModifier_titre_image->setEnabled(true);
    _timer->stop();
    demandeMajMode();
    demandeMajStatusBar();
}

void LecteurVue::demandeSuivant()
{
    getMode() == QString(tr("Auto")) ? demandeArreter() : demandeImageSuivante();
}

void LecteurVue::demandePrecedent()
{
    getMode() == QString(tr("Auto")) ? demandeArreter() : demandeImagePrecedente();
}

void LecteurVue::demandeMajMode()
{
    QString manuelMode(tr("Manuel"));
    getMode() == manuelMode ? setMode(QString(tr("Auto"))) : setMode(QString(tr("Manuel")));
}

void LecteurVue::setMode(QString m)
{
    _mode = m;
}

QString LecteurVue::getMode() const
{
    return _mode;
}

void LecteurVue::demandeMajIntitule()
{
    if (_modele->numDiaporamaCourant() == 0)
    {
        ui->intitule->setText("Aucun diaporama");
    }
    else
    {
        QString numDiapo, nomImage, categorie;
        numDiapo = QString::number(_modele->numDiaporamaCourant());
        nomImage = QString::fromStdString(_modele->imageCourante()->getTitre());
        categorie = QString::fromStdString(_modele->imageCourante()->getCategorie());
        ui->intitule->setText(tr("Diaporama ") + numDiapo + tr(" - Titre : ") + nomImage + tr(" - Categorie : ") + categorie);
    }
}

void LecteurVue::demandeMajStatusBar()
{
    int rangImg = _modele->imageCourante()->getRang();
    int nbImg = _modele->nbImages();
    QString rangImgStr = QString::number(rangImg);
    QString nbImgStr = QString::number(nbImg);
    ui->statusbar->showMessage(tr("mode : ") + getMode() + tr("             images : ") + rangImgStr + tr(" / ") + nbImgStr);
}

LecteurVue::~LecteurVue()
{
    delete ui;
}

