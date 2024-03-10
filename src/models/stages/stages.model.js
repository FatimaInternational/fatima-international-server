const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createNewStage(stage) {
  return new Promise((resolve, reject) => {
    if (
      !stage ||
      !stage.shipment_number ||
      !stage.date ||
      !stage.status ||
      !stage.location
    ) {
      return reject("Missing Values");
    }

    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      console.log("STAGE: ", stage);
      const query =
        "INSERT INTO stages (shipment_number, date, status, location, info) VALUES (?,?,?,?,?)";
      connection.query(
        query,
        [
          stage.shipment_number,
          stage.date,
          stage.status,
          stage.location,
          stage.info,
        ],
        (err, rows) => {
          connection.release();
          if (err) return reject(err);
          return resolve(rows[0]);
        }
      );
    });
  });
}

async function getStagesByShipmentNumber(number) {
  return new Promise((resolve, reject) => {
    if (!number) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      const query = "SELECT * FROM stages WHERE shipment_number = ?";
      connection.query(query, [number], (err, rows) => {
        connection.release();
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  });
}

async function deleteStageById(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      const query = "DELETE FROM stages WHERE id = ?";
      connection.query(query, [id], (err, rows) => {
        connection.release();
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  });
}

module.exports = {
  createNewStage,
  getStagesByShipmentNumber,
  deleteStageById,
};
