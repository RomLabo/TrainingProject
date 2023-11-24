#include "lecteur_choix_diapo.h"
#include "ui_lecteur_choix_diapo.h"

LecteurChoixDiapo::LecteurChoixDiapo(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::LecteurChoixDiapo)
{
    ui->setupUi(this);
    setWindowTitle(tr("Choix diaporama"));
    connect(ui->comboBox,SIGNAL(currentIndexChanged(int)),this,SLOT(setValue(int)));
    connect(ui->okBtn,SIGNAL(clicked()),this,SLOT(accept()));
    connect(ui->annulerBtn,SIGNAL(clicked()),this,SLOT(reject()));
}

void LecteurChoixDiapo::setValue(int n)
{
    _value = n;
}

int LecteurChoixDiapo::getValue() const
{
    return _value;
}

void LecteurChoixDiapo::addItems(QStringList lst)
{
    ui->comboBox->clear();
    ui->comboBox->addItems(lst);
}

LecteurChoixDiapo::~LecteurChoixDiapo()
{
    delete ui;
}
