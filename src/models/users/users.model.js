const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createNewUser(user) {
  if (
    !user ||
    !user.username ||
    !user.password ||
    !user.rank ||
    (user.rank !== "admin" && user.rank !== "user")
  ) {
    return new Promise((resolve, reject) => {
      return reject("Missing Values or Invalid Rank");
    });
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);

  return new Promise((resolve, reject) => {
    getUserByUsername(user.username.toLowerCase())
      .then((user) => {
        if (user) {
          return reject("Username already exists");
        }
      })
      .catch((err) => {
        pool.getConnection((err, connection) => {
          if (err) return reject(err);
          const query =
            "INSERT INTO users (username, password, rank) VALUES (?, ?, ?)";
          pool.query(
            query,
            [user.username.toLowerCase(), hashedPassword, user.rank],
            (err, rows) => {
              connection.release();
              if (err) {
                return reject(err);
              } else {
                return resolve(rows);
              }
            }
          );
        });
      });
  });
}

async function getAllUsers() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      pool.query("SELECT id, username, rank FROM users", (err, rows) => {
        connection.release();
        if (err) {
          return reject(err);
        } else {
          return resolve(rows);
        }
      });
    });
  });
}

async function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      pool.query(
        "SELECT * FROM users WHERE users.username=?",
        [username.toLowerCase()],
        (err, rows) => {
          connection.release();
          if (err) {
            console.log(err);
            return reject(err);
          } else {
            if (rows.length === 0) {
              return reject("No User Found");
            } else {
              return resolve(rows[0]);
            }
          }
        }
      );
    });
  });
}

async function authenticateUser(credentials) {
  return new Promise(async (resolve, reject) => {
    if (!credentials || !credentials.username || !credentials.password) {
      return reject("Missing Values");
    }
    const { username, password } = credentials;
    await getUserByUsername(username)
      .then(async (user) => {
        bcrypt.compare(password, user.password, function (err, res) {
          if (err) {
            console.log("ERRRR", err);
            return reject("Error 60");
          }
          if (res) {
            const accessToken = generateAccessToken({
              username: user.username,
              rank: user.rank,
            });
            console.log("accessToken", accessToken);
            return resolve(accessToken);
          } else {
            return reject({ error: "invalid Password", message: err });
          }
        });
      })
      .catch((error) => {
        return reject("invalid Username");
      });
  });
}

async function changeUserPassword(username, newPassword) {
  if (!username || !newPassword) {
    return new Promise((resolve, reject) => {
      return reject("Missing Values");
    });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "UPDATE users SET password=? WHERE username=?";
      pool.query(
        query,
        [hashedPassword, username.toLowerCase()],
        (err, rows) => {
          connection.release();
          if (err) {
            return reject(err);
          } else {
            console.log("here");
            return resolve(rows);
          }
        }
      );
    });
  });
}

async function confirmAdmin(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject("Missing Values");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "SELECT * FROM users WHERE username=? AND rank=?";
      pool.query(query, [username.toLowerCase(), "admin"], (err, rows) => {
        connection.release();
        if (err) {
          return reject(err);
        } else {
          return resolve(rows);
        }
      });
    });
  });
}

async function deleteUserByUsername(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject("Missing username");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "DELETE FROM users WHERE username=?";
      pool.query(query, [username.toLowerCase()], (err, rows) => {
        connection.release();
        if (err) {
          return reject(err);
        } else {
          return resolve(rows);
        }
      });
    });
  });
}
async function promoteUserByUsername(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject("Missing username");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "UPDATE users SET rank=? WHERE username=?";
      pool.query(query, ["admin", username.toLowerCase()], (err, rows) => {
        connection.release();
        if (err) {
          return reject(err);
        } else {
          return resolve(rows);
        }
      });
    });
  });
}
async function demoteUserByUsername(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject("Missing username");
    }
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      const query = "UPDATE users SET rank=? WHERE username=?";
      pool.query(query, ["user", username.toLowerCase()], (err, rows) => {
        connection.release();
        if (err) {
          return reject(err);
        } else {
          return resolve(rows);
        }
      });
    });
  });
}

function generateAccessToken(user) {
  return jwt.sign(
    {
      data: user,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "60m" }
  );
}

module.exports = {
  createNewUser,
  authenticateUser,
  changeUserPassword,
  confirmAdmin,
  getAllUsers,
  getUserByUsername,
  deleteUserByUsername,
  promoteUserByUsername,
  demoteUserByUsername,
};
