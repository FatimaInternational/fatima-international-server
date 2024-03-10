const express = require("express");

const {
    httpCreateNewStage,
    httpGetStagesByShipmentNumber,
    httpDeleteStage,
} = require("./stages.controller");


const {
  authenticateToken
} = require("../../authentication")


const stagesRouter = express.Router();

stagesRouter.get("/:number", httpGetStagesByShipmentNumber)
stagesRouter.post("/",authenticateToken, httpCreateNewStage)
stagesRouter.delete("/:id", authenticateToken, httpDeleteStage)



stagesRouter.get("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

stagesRouter.post("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

stagesRouter.put("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

stagesRouter.delete("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports = stagesRouter;
