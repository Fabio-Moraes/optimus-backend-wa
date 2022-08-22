CREATE TABLE IF NOT EXISTS optimus (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  business VARCHAR(60),
  employee VARCHAR(60),
  name VARCHAR(60),
  phone VARCHAR(60),
  service VARCHAR(60),
  identifier VARCHAR(60),
  create_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  service_date DATE,
  service_time TIME
);

-- source /home/fabio/Projetos/Workspace/optimus/src/database/script.sql