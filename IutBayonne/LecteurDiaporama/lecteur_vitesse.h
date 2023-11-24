#ifndef LECTEUR_VITESSE_H
#define LECTEUR_VITESSE_H

#include <QDialog>

namespace Ui {
class LecteurVitesse;
}

class LecteurVitesse : public QDialog
{
    Q_OBJECT

public:
    explicit LecteurVitesse(QWidget *parent = nullptr);
    ~LecteurVitesse();
    int getValue() const; // Retourne la valeur de _value (valeur choisie par l'utilisateur).
public slots:
    void setValue(int); // Affecte une nouvelle valeur à la donnée menbre _value
private:
    Ui::LecteurVitesse *ui;
    int _value; // La valeur de la vitesse sélectionnée.
};

#endif // LECTEUR_VITESSE_H
