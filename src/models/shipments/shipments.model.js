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

async function createNewShipment(shipment) {
  return new Promise((resolve, reject) => {
    if (
      !shipment ||
      !shipment.number ||
      !shipment.status ||
      !shipment.sender ||
      !shipment.recipient ||
      !shipment.recipient_phone ||
      !shipment.pickup_location ||
      !shipment.delivery_location ||
      !shipment.shipping_service ||
      !shipment.delivery_standard
    ) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query =
        "INSERT INTO shipments (number, status, sender, recipient, recipient_phone, pickup_location, delivery_location, shipping_service, delivery_standard, date_created) VALUES (?,?,?,?,?,?,?,?,?,?)";
      connection.query(
        query,
        [
          shipment.number.toUpperCase(),
          shipment.status,
          shipment.sender,
          shipment.recipient,
          shipment.recipient_phone,
          shipment.pickup_location,
          shipment.delivery_location,
          shipment.shipping_service,
          shipment.delivery_standard,
          Date.now().toString(),
        ],
        (err, rows) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          return resolve(rows[0]);
        }
      );
    });
  });
}

async function getShipmentByNumber(number) {
  return new Promise((resolve, reject) => {
    if (!number) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "SELECT * FROM shipments WHERE number = ?";
      connection.query(query, [number.toUpperCase()], (err, rows) => {
        connection.release();
        if (err) return reject(err);
        return resolve(rows[0]);
      });
    });
  });
}

async function deleteShipmentByNumber(number) {
  return new Promise((resolve, reject) => {
    if (!number) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query1 = "DELETE FROM stages WHERE shipment_number = ?";
      connection.query(query1, [number.toUpperCase()], (err, rows) => {
        if (err) return reject(err);
        const query2 = "DELETE FROM shipments WHERE number = ?";
        connection.query(query2, [number.toUpperCase()], (err, rows) => {
          connection.release();
          if (err) return reject(err);
          return resolve(rows);
        });
      });
    });
  });
}

async function changeShipmentStatus(number, status, progress, color) {
  return new Promise((resolve, reject) => {
    if (!number || !status) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "UPDATE shipments SET status = ?, progress = ?, color = ? WHERE number = ?";
      connection.query(query, [status, progress, color, number.toUpperCase()], (err, rows) => {
        connection.release();
        if (err) return reject(err);
        return resolve(rows[0]);
      });
    });
  });
}

async function changeShipmentInfo(shipment) {
  return new Promise((resolve, reject) => {
    if (
      !shipment ||
      !shipment.number ||
      !shipment.sender ||
      !shipment.recipient ||
      !shipment.recipient_phone ||
      !shipment.pickup_location ||
      !shipment.delivery_location ||
      !shipment.shipping_service ||
      !shipment.delivery_standard
    ) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query =
        "UPDATE shipments SET sender = ?, recipient = ?, recipient_phone = ?, pickup_location = ?, delivery_location = ?, shipping_service = ?, delivery_standard = ? WHERE number = ?";
      connection.query(
        query,
        [
          shipment.sender,
          shipment.recipient,
          shipment.recipient_phone,
          shipment.pickup_location,
          shipment.delivery_location,
          shipment.shipping_service,
          shipment.delivery_standard,
          shipment.number.toUpperCase(),
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

module.exports = {
  createNewShipment,
  getShipmentByNumber,
  deleteShipmentByNumber,
  changeShipmentStatus,
  changeShipmentInfo,
};
