--TP5/GROUPE33/CRUSSIERE_DIRCHAOUI_LABORDE/14_12_2022

CREATE TABLE TRANCHE (
code NUMBER(4),
revenuPlancher NUMBER(8)NOT NULL,
revenuPlafond NUMBER(8)NOT NULL,
PRIMARY KEY (code)
);

CREATE TABLE PRESTATION(
code NUMBER(4) PRIMARY KEY,
libelle VARCHAR2(35)
);

CREATE TABLE FAMILLE(
code NUMBER(4) ,
nomChef VARCHAR2(20)NOT NULL,
prenomChef VARCHAR2(20)NOT NULL,
numRue VARCHAR2(20)NOT NULL,
nomRue VARCHAR2(35)NOT NULL,
compAdr VARCHAR2(20)NOT NULL,
codePost VARCHAR2(20)NOT NULL,
ville VARCHAR2(20)NOT NULL,
tel NUMBER(10)NOT NULL,
nbEnfants NUMBER(2)NOT NULL,
codeTranche NUMBER(4)NOT NULL,
PRIMARY KEY (code),
FOREIGN KEY(codeTranche) REFERENCES TRANCHE(code)
);

CREATE TABLE PAYER(
codeTranche NUMBER(4),
codePrestation NUMBER(4),
PRIMARY KEY (codeTranche,codePrestation),
FOREIGN KEY(codeTranche) REFERENCES TRANCHE(code),
FOREIGN KEY (codePrestation) REFERENCES Prestation(code),
tarif DECIMAL(3,2) NOT NULL
);

INSERT INTO TRANCHE VALUES(1,0,6000);
INSERT INTO TRANCHE VALUES(2,6001,12000);
INSERT INTO TRANCHE VALUES(3,12001,18000);
INSERT INTO TRANCHE VALUES(4,18001,24000);
INSERT INTO PRESTATION VALUES(2,'Repas Restaurant Scolaire');
INSERT INTO PRESTATION VALUES(4,'Garderie matin');
INSERT INTO PRESTATION VALUES(5,'Garderie soiree');
INSERT INTO FAMILLE VALUES(1,'Macron','Emmanuel','7','Avenue Charles De Gaulle','Lieu dit Deguila','75000','Paris',0630548784,2,4);
INSERT INTO FAMILLE VALUES(2,'Tronchet','Emmanuel','25','Boulevard de Richemont','Escalier B','64100','Bayonne',0754854658,2,3);
INSERT INTO PAYER VALUES(4,4,1.20);
INSERT INTO PAYER VALUES(3,2,2.55);