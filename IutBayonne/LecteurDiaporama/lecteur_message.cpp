#include "lecteur_message.h"

LecteurMessage::LecteurMessage(QWidget *parent) :
    QMessageBox(parent)
{
    setWindowTitle(tr("A propos de..."));
    setText(
        tr("Version : 2.0 \nDate de création : 17/04/2023 \nAuteurs : Damageux, Dirchaoui, Laborde")
    );
}

LecteurMessage::~LecteurMessage()
{}
