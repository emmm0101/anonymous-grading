-- create TABLE project (
--     projectID INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT,
--     link  TEXT
-- )

-- create TABLE user (
--     userID INTEGER PRIMARY KEY AUTOINCREMENT,
--     first_name TEXT,
--     last_name  TEXT,
--     email TEXT,
--     password TEXT,
--     account_type TEXT,
--     projectID INTEGER,
--     FOREIGN KEY (projectID) REFERENCES project(projectID)
-- )

-- create TABLE deliverable (
--     deliverableID INTEGER PRIMARY KEY AUTOINCREMENT,
--     projectID INTEGER,
--     ddl_date TEXT,
--     FOREIGN KEY(projectID) REFERENCES project(projectID)
     
-- )

-- create table grades_history ( 
--      userID INTEGER,
--     deliverableID INTEGER,
--     grade REAL,
--     FOREIGN KEY(deliverableID) REFERENCES deliverable(deliverableID),
--     FOREIGN KEY(userID) REFERENCES user(userID)
-- )

-- INSERT INTO user (
--       userID,
--       first_name,
--       last_name,
--       email,
--       password,
--       account_type,
--       projectID
--     )
--   VALUES (
--       null,
--           "Marin",
--           'Ionescu',
--           'marinionescu@student.ase.ro',
--           'test4',
--           'STUDENT',
--           null

--     );

-- INSERT INTO project (projectID, name, link)
--           VALUES (
--               1,
--               "proiect1",
--               'https://github.com/anaandreescu/proiect1
--           '
--             );

