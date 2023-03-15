const mysql = require('mysql');

class Mysql {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.MYSQL_DB,
    });
  }

  query(queryString) {
    const pool = this.pool;

    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log('error while getting connection', err);
          return reject(err);
        }

       
        connection.query(queryString, function (error, results, fields) {
          
          console.log("Q: ",queryString);
          connection.release();

          
          if (error) {
            reject(error);
          }

          resolve(results);

         
        });
      });
    });
  }

  escape(str) {
    return mysql.escape(str);
  }
}

module.exports = new Mysql();
