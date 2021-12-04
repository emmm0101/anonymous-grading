/* create TABLE user (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name  TEXT,
    email TEXT,
    password TEXT,
    account_type TEXT
) */

/* create TABLE project (
    projectID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    link  TEXT
) */

/* create TABLE deliverable (
    deliverableID INTEGER PRIMARY KEY AUTOINCREMENT,
    projectID INTEGER,
    ddl_date TEXT,
    FOREIGN KEY(projectID) REFERENCES project(projectID)
     
) */

/* create table member ( */
    /* userID INTEGER,
    deliverableID INTEGER,
    grade REAL,
    FOREIGN KEY(deliverableID) REFERENCES deliverable(deliverableID),
    FOREIGN KEY(userID) REFERENCES user(userID)
) */

drop TABLE test