const express = require("express");

const {
  httpGetAllUsers,
  // httpGetUserById,
  httpCreateUser,
  httpAuthenticateUser,
  httpGetUserByUsername,
  httpChangeUserPassword,
  httpDeleteUser,
  httpPromoteUser,
  httpDemoteUser
} = require("./users.controller");

const {
  authenticateToken
} = require("../../authentication")

const usersRouter = express.Router();

// usersRouter.get("/", httpGetAllUsers)
usersRouter.post("/",authenticateToken, httpCreateUser)
usersRouter.get("/", authenticateToken, httpGetAllUsers)
usersRouter.post("/login", httpAuthenticateUser);
usersRouter.put("/password", authenticateToken, httpChangeUserPassword)
usersRouter.get("/me", authenticateToken, (req, res) =>{
  return res.status(200).json(req.user.data); 
});
usersRouter.delete("/user/:username", authenticateToken, httpDeleteUser)
usersRouter.get("/promote/:username", authenticateToken, httpPromoteUser)
usersRouter.get("/demote/:username", authenticateToken, httpDemoteUser)
usersRouter.get("/:username", authenticateToken, httpGetUserByUsername)

//endpoint to change user password


usersRouter.get("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

usersRouter.post("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

usersRouter.put("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

usersRouter.delete("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports = usersRouter;
