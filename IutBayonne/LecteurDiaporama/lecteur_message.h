#ifndef LECTEUR_MESSAGE_H
#define LECTEUR_MESSAGE_H

#include <QMessageBox>

class LecteurMessage : public QMessageBox
{
    Q_OBJECT
public:
    LecteurMessage(QWidget *parent = nullptr);
    ~LecteurMessage();
};

#endif // LECTEUR_MESSAGE_H

