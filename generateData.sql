DROP TABLE IF EXISTS Aircraft;
DROP TABLE IF EXISTS Type;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Entry;

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

CREATE TABLE Entry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  aircraft_type VARCHAR(20) NOT NULL,
  tail_num VARCHAR(20) NOT NULL,
  origin VARCHAR(10) NOT NULL,
  dest VARCHAR(10) NOT NULL,
  total_time DECIMAL(4,2) NOT NULL,

  FOREIGN KEY (user) REFERENCES User(username)
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

INSERT INTO Entry (user, date, aircraft_type, tail_num, origin, dest, total_time) VALUES 
('hbanks', '2023-04-20', 'DHC-3T', 'N90422', 'S60', 'FRD', 1.5),
('hbanks', '2023-04-20', 'DHC-3T', 'N90422', 'FRD', 'S60', 1.5),
('hbanks', '2023-04-21', 'DHC-3T', 'N87KA', 'S60', 'FRD', 1.5);