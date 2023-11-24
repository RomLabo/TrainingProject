#ifndef DATABASE_H
#define DATABASE_H

#include <QSqlDatabase>

#define DATABASE_NAME "rlaborde003_bd"
#define CONNECT_TYPE "QODBC"
#define USERNAME "rlaborde003_bd"
#define HOSTNAME "lakartxela.iutbayonne.univ-pau.fr"
#define PORT 3306

class Database {

public:
    Database();
    bool openDataBase(); // Permet d'ouvrir la base de donnée
    void closeDataBase(); // Permet de fermer la base de donnée
private:
    QSqlDatabase myDb;
};

#endif // DATABASE_H
