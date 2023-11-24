QT       += core gui sql
QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    database.cpp \
    diaporama.cpp \
    image.cpp \
    lecteur_choix_diapo.cpp \
    lecteur_message.cpp \
    lecteur_modele.cpp \
    lecteur_modif_intitule.cpp \
    lecteur_vitesse.cpp \
    lecteur_vue.cpp \
    main.cpp

HEADERS += \
    database.h \
    diaporama.h \
    image.h \
    lecteur_choix_diapo.h \
    lecteur_message.h \
    lecteur_modele.h \
    lecteur_modif_intitule.h \
    lecteur_vitesse.h \
    lecteur_vue.h

FORMS += \
    lecteur_choix_diapo.ui \
    lecteur_modif_intitule.ui \
    lecteur_vitesse.ui \
    lecteur_vue.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    ressourcesDiapo.qrc
