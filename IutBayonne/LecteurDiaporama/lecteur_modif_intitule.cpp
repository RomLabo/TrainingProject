#include "lecteur_modif_intitule.h"
#include "ui_lecteur_modif_intitule.h"

LecteurModifIntitule::LecteurModifIntitule(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::LecteurModifIntitule)
{
    ui->setupUi(this);
    connect(ui->okBtn, SIGNAL(clicked()),this,SLOT(accept()));
    connect(ui->okBtn, SIGNAL(clicked()),this,SLOT(setValue()));
    connect(ui->anBtn, SIGNAL(clicked()),this,SLOT(reject()));
}

LecteurModifIntitule::~LecteurModifIntitule()
{
    delete ui;
}

QString LecteurModifIntitule::getValue()
{
    return _value;
}

void LecteurModifIntitule::setValue()
{
    _value = ui->titreEdit->text();
    ui->titreEdit->setText("");
}
