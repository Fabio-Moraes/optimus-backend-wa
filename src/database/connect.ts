import mysql from 'mysql';

export const db = mysql.createPool({
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'b6e5116b10a3f3',
  password: 'f44c1bed',
  database: 'heroku_4e63847dfe579bb',
});

// mysql -h localhost -u root -p

// mysql -h us-cdbr-east-05.cleardb.net -u b6e5116b10a3f3 -p
