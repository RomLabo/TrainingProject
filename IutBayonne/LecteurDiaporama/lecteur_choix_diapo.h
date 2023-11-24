#ifndef LECTEURCHOIXDIAPO_H
#define LECTEURCHOIXDIAPO_H
#include <QDialog>

namespace Ui {
class LecteurChoixDiapo;
}

class LecteurChoixDiapo : public QDialog
{
    Q_OBJECT

public:
    explicit LecteurChoixDiapo(QWidget *parent = nullptr);
    ~LecteurChoixDiapo();
    int getValue() const; // Retourne la valeur de _value (valeur choisie par l'utilisateur).
    void addItems(QStringList); // Ajoute les choix disponibles dans la liste
public slots:
    void setValue(int); // Affecte une nouvelle valeur à la donnée menbre _value
private:
    Ui::LecteurChoixDiapo *ui;
    int _value; // Le choix du diapo sélectionné par l'utilisateur.
};

#endif // LECTEURCHOIXDIAPO_H
