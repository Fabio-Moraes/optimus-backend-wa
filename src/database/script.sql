CREATE TABLE IF NOT EXISTS optimus (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  business VARCHAR(60),
  name VARCHAR(60),
  phone VARCHAR(60),
  service VARCHAR(60),
  coupon VARCHAR(60),
  create_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  service_date DATE,
  service_time TIME
);

-- INSERT INTO venda (dataEntrega, horaEntrega)
-- VALUES ("2018-12-03", "13:40:00");