const {
  createNewUser,
  authenticateUser,
  changeUserPassword,
  confirmAdmin,
  getAllUsers,
  getUserByUsername,
  deleteUserByUsername,
  promoteUserByUsername,
  demoteUserByUsername,
} = require("../../models/users/users.model");

// Create New User
async function httpCreateUser(req, res) {
  const user = req.body;
  // const key = req.headers["x-api-key"];

  if (!user.username || !user.password) {
    return res.status(400).json({
      error: "missing required User property",
    });
  }
  // if (!key) {
  //   return res.status(401).json({
  //     error: "missing required api key",
  //   });
  // }
  // if (key !== process.env.API_KEY) {
  //   return res.status(401).json({
  //     error: "invalid api key",
  //   });
  // }
  try {
    await confirmAdmin(req.user.data.username)
      .then(async (response) => {
        await createNewUser(user)
          .then((response) => {
            return res.status(201).end();
          })
          .catch((error) => {
            return res.status(409).json({
              error: "couldn't Create user",
              message: error,
            });
          });
      })
      .catch((error) => {
        return res.status(401).json({
          error: "unauthorized",
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: "server error",
    });
  }
}

// Authenticate user's credentials and return tokens
async function httpAuthenticateUser(req, res) {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        error: "Missing username or Password",
      });
    }
    const credentials = {
      username: req.body.username,
      password: req.body.password,
    };
    await authenticateUser(credentials)
      .then((token) => {
        return res.status(200).json({
          token: token,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          error: "username or Password are incorrect",
          message: error,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: "server error",
    });
  }
}

async function httpGetUserByUsername(req, res) {
  if (!req || !req.user || !req.user.data || !req.user.data.rank) {
    return res.status(401).json({
      error: "unauthorized",
    });
  }
  if (req.user.data.rank !== "admin") {
    return res.status(401).json({
      error: "unauthorized",
    });
  }
  await getUserByUsername(req.params.username)
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json({
        error: "couldn't get user",
        message: error,
      });
    });
}

async function httpChangeUserPassword(req, res) {
  if (
    !req ||
    !req.user ||
    !req.body ||
    !req.body.oldPassword ||
    !req.body.newPassword
  ) {
    return res.status(401).json({
      error: "missing required properties",
    });
  }
  const credentials = {
    username: req.user.data.username,
    password: req.body.oldPassword,
  };
  await authenticateUser(credentials)
    .then(async (token) => {
      console.log("correct");
      await changeUserPassword(req.user.data.username, req.body.newPassword)
        .then((response) => {
          return res.status(200).json({});
        })
        .catch((error) => {
          return res.status(400).json({
            error: "couldn't change password",
            message: error,
          });
        });
    })
    .catch(async (error) => {
      console.log("incorrect");
      return res.status(401).json({
        error: "incorrect password",
      });
    });
}

async function httpGetAllUsers(req, res) {
  if (
    !req ||
    !req.user ||
    !req.user.data ||
    !req.user.data.rank ||
    !req.user.data.username
  ) {
    return res.status(401).json({
      error: "unauthorized",
    });
  }
  if (req.user.data.rank !== "admin") {
    return res.status(401).json({
      error: "unauthorized",
    });
  }
  await confirmAdmin(req.user.data.username)
    .then(async (response) => {
      await getAllUsers()
        .then((response) => {
          return res.status(200).json(response);
        })
        .catch((error) => {
          return res.status(400).json({
            error: "couldn't get users",
            message: error,
          });
        });
    })
    .catch((error) => {
      return res.status(401).json({
        error: "unauthorized",
      });
    });
}

async function httpDeleteUser(req, res) {
  await confirmAdmin(req.user.data.username)
    .then(async (response) => {
      if (!req.params || !req.params.username) {
        return res.status(400).json({
          error: "missing username",
        });
      }
      await deleteUserByUsername(req.params.username)
        .then((response) => {
          return res.sendStatus(204);
        })
        .catch((error) => {
          return res.sendStatus(400).json({
            error: "couldn't delete user",
            message: error,
          });
        });
    })
    .catch((error) => {
      return res.status(401).json({
        error: "unauthorized",
        message: error,
      });
    });
}

async function httpPromoteUser(req, res) {
  await confirmAdmin(req.user.data.username)
    .then(async (response) => {
      if (!req.params || !req.params.username) {
        return res.status(400).json({
          error: "missing username",
        });
      } else {
        await promoteUserByUsername(req.params.username)
          .then((response) => {
            return res.sendStatus(204);
          })
          .catch((error) => {
            return res.sendStatus(400).json({
              error: "couldn't promote user",
              message: error,
            });
          });
      }
    })
    .catch((error) => {
      return res.status(401).json({
        error: "unauthorized",
        message: error,
      });
    });
}
async function httpDemoteUser(req, res) {
  await confirmAdmin(req.user.data.username)
    .then(async (response) => {
      if (!req.params || !req.params.username) {
        return res.status(400).json({
          error: "missing username",
        });
      } else {
        await demoteUserByUsername(req.params.username)
          .then((response) => {
            return res.sendStatus(204);
          })
          .catch((error) => {
            return res.sendStatus(400).json({
              error: "couldn't demote user",
              message: error,
            });
          });
      }
    })
    .catch((error) => {
      return res.status(401).json({
        error: "unauthorized",
        message: error,
      });
    });
}

module.exports = {
  httpGetAllUsers,
  // httpGetUserById,
  httpGetUserByUsername,
  httpCreateUser,
  httpAuthenticateUser,
  httpChangeUserPassword,
  // httpAuthenticateToken,
  httpDeleteUser,
  httpPromoteUser,
  httpDemoteUser,
};
