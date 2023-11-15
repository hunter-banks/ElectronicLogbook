DROP TABLE IF EXISTS Aircraft;
DROP TABLE IF EXISTS Type;
DROP TABLE IF EXISTS User;

CREATE TABLE Type (
  id VARCHAR(20) PRIMARY KEY,
  description VARCHAR(50) NOT NULL
);

CREATE TABLE Aircraft (
  id VARCHAR(25),
  make VARCHAR(50),
  model VARCHAR(50),
  type_id VARCHAR(20),
  PRIMARY KEY (id, type_id),
  FOREIGN KEY (type_id) REFERENCES Type(id)
);

CREATE TABLE User (
    username VARCHAR(255) PRIMARY KEY,
    password_hash VARCHAR(64) NOT NULL
);

INSERT INTO Type VALUES
('ASEL', 'Airplane Single Engine Land'),
('ASES', 'Airplane Single Engine Sea'),
('AMEL', 'Airplane Multi Engine Land'),
('AMES', 'Airplane Multi Engine Sea');

INSERT INTO Aircraft VALUES
('CE-172', 'Cessna', '172', 'ASEL'),
('CE-172', 'Cessna', '172', 'ASES'),
('CE-180', 'Cessna', '180', 'ASEL'),
('CE-180', 'Cessna', '180', 'ASES'),
('DHC-3T', 'de Havilland', 'Turbine Otter', 'ASES'),
('DHC-2', 'de Havilland', 'Beaver', 'ASES'),
('DHC-2T', 'de Havilland', 'Turbine-Beaver', 'ASES'),
('PA-28', 'Piper', 'Cherokee', 'ASEL'),
('PA-44', 'Piper', 'Seminole', 'AMEL');

INSERT INTO User VALUES 
('hbanks', SHA2('password', 256));