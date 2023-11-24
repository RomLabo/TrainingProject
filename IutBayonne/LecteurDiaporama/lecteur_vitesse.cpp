#include "lecteur_vitesse.h"
#include "ui_lecteur_vitesse.h"

LecteurVitesse::LecteurVitesse(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::LecteurVitesse)
{
    ui->setupUi(this);
    setWindowTitle(tr("Vitesse de défilement"));
    connect(ui->dial,SIGNAL(valueChanged(int)),this,SLOT(setValue(int)));
    connect(ui->okBtn,SIGNAL(clicked()),this,SLOT(accept()));
    connect(ui->anBtn,SIGNAL(clicked()),this,SLOT(reject()));
}

void LecteurVitesse::setValue(int n)
{
    _value = n;
    QString lcdTxt;
    lcdTxt.setNum(_value);
    ui->lcd->setText(lcdTxt);
}

int LecteurVitesse::getValue() const
{
    return _value;
}

LecteurVitesse::~LecteurVitesse()
{
    delete ui;
}
