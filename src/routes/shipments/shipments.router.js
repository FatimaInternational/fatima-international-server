const express = require("express");

const {
  httpGetShipmentByNumber,
  httpCreateShipment,
  httpDeleteShipmentByNumber,
  httpChangeShipmentStatus,
  httpChangeShipmentInfo,
} = require("./shipments.controller");

const {
  authenticateToken
} = require("../../authentication")

const shipmentsRouter = express.Router();

shipmentsRouter.post("/",authenticateToken, httpCreateShipment);
shipmentsRouter.post("/search", httpGetShipmentByNumber);
shipmentsRouter.delete("/:number",authenticateToken, httpDeleteShipmentByNumber);
shipmentsRouter.put("/status",authenticateToken, httpChangeShipmentStatus);
shipmentsRouter.put("/info",authenticateToken, httpChangeShipmentInfo);

shipmentsRouter.get("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

shipmentsRouter.post("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

shipmentsRouter.put("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

shipmentsRouter.delete("*", function (req, res) {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports = shipmentsRouter;
