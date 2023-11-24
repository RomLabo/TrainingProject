#include "database.h"
#include <QSqlQuery>

Database::Database()
{
    myDb = QSqlDatabase::addDatabase(CONNECT_TYPE);
    myDb.setHostName(HOSTNAME);
    myDb.setPort(PORT);
    myDb.setDatabaseName("rlaborde");
    myDb.setUserName(USERNAME);
    myDb.setPassword(USERNAME);

    bool a = openDataBase();
    qDebug() << "Database : " << a;
}

bool Database::openDataBase() {
    return myDb.open();
}

void Database::closeDataBase() {
    myDb.close();
}
