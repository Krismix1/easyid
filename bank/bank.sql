CREATE DATABASE IF NOT EXISTS bank;
USE bank;

CREATE TABLE IF NOT EXISTS accounts (
    id     int unsigned NOT NULL AUTO_INCREMENT,
    email  varchar(32) UNIQUE NOT NULL,
    amount float,
    PRIMARY KEY(id)
);

INSERT INTO accounts(email, amount) VALUES ("a@a.com", 5000), ("b@a.com", 1000);