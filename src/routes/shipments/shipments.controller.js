const {
  createNewShipment,
  getShipmentByNumber,
  deleteShipmentByNumber,
  changeShipmentStatus,
  changeShipmentInfo,
} = require("../../models/shipments/shipments.model");

async function httpCreateShipment(req, res) {
  if (!req || !req.body || !req.body.shipment) {
    
    return res.status(400).json({
      error: "Bad Request",
    });
  }
  await createNewShipment(req.body.shipment)
    .then((response) => {
      return res.sendStatus(201);
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Couldn't Create Shipment",
        message: error,
      });
    });
}

async function httpGetShipmentByNumber(req, res) {
  if (!req || !req.body || !req.body.number) {
    console.log(req.body)
    return res.status(400).json({
      error: "Bad Request",
    });
  }

  await getShipmentByNumber(req.body.number)
  .then((response) => {
    return res.status(200).json(response);
  })
  .catch((error) => {
    return res.status(400).json({
        error: "Couldn't get Shipment",
        message: error,
    })
  })
}

async function httpDeleteShipmentByNumber(req,res){
  if(!req || !req.params || !req.params.number){
    return res.status(400).json({
      error: "Bad Request",
    });
  }
  await deleteShipmentByNumber(req.params.number)
  .then((response) => {
    return res.sendStatus(204);
  })
  .catch((error) => {
    return res.status(400).json({
      error: "Couldn't delete Shipment",
      message: error,
    })
  })
}

async function httpChangeShipmentStatus(req,res){
  if(!req || !req.body || !req.body.number || !req.body.status || !req.body.progress || (req.body.color == undefined || req.body.color == null)){
    console.log(req.body.color)
    return res.status(400).json({
      error: "Bad Request",
    })
  }
  await changeShipmentStatus(req.body.number,req.body.status, req.body.progress, req.body.color)
  .then((response) => {
    return res.status(200).json(response);
  })
  .catch((error) => {
    return res.status(400).json({
      error: "Couldn't change Shipment status",
      message: error,
    })
  })
}

async function httpChangeShipmentInfo(req,res){
  if(!req || !req.body || !req.body.shipment){
    return res.status(400).json({
      error: "Bad Request",
    })
  }
  await changeShipmentInfo(req.body.shipment)
  .then((response) => {
    return res.sendStatus(200)
  })
  .catch((error) => {
    return res.status(400).json({
      error: "Couldn't change Shipment info",
      message: error,
    })
  })
}


module.exports = {
    httpCreateShipment,
    httpGetShipmentByNumber,
    httpDeleteShipmentByNumber,
    httpChangeShipmentStatus,
    httpChangeShipmentInfo
}