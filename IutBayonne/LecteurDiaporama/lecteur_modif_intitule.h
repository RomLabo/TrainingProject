#ifndef LECTEUR_MODIF_INTITULE_H
#define LECTEUR_MODIF_INTITULE_H

#include <QDialog>

namespace Ui {
class LecteurModifIntitule;
}

class LecteurModifIntitule : public QDialog
{
    Q_OBJECT

public:
    explicit LecteurModifIntitule(QWidget *parent = nullptr);
    ~LecteurModifIntitule();
    QString getValue(); // retourne le titre saisi par l'utilisateur

private:
    Ui::LecteurModifIntitule *ui;
    QString _value; // la valeur saisie par l'utilisateur
private slots:
    void setValue();
};

#endif // LECTEUR_MODIF_INTITULE_H
