CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    datecreated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
