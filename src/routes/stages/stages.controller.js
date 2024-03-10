const {
  createNewStage,
  getStagesByShipmentNumber,
  deleteStageById,
} = require("../../models/stages/stages.model");

async function httpCreateNewStage(req, res) {
  if (!req || !req.body || !req.body.stage) {
    return res.status(400).json({
      error: "Couldn't Create Stage",
      message: "Missing required fields",
    });
  }

  await createNewStage(req.body.stage)
    .then((response) => {
      return res.sendStatus(201);
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Couldn't Create Stage",
        message: error,
      });
    });
}

async function httpGetStagesByShipmentNumber(req, res) {
  if (!req || !req.params || !req.params.number) {
    return res.status(400).json({
      error: "Couldn't get stages",
      message: "Missing required fields",
    });
  }
  await getStagesByShipmentNumber(req.params.number)
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json({
        error: "couldn't get stages",
        message: error,
      });
    });
}

async function httpDeleteStage(req, res) {
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json({
      error: "Couldn't delete stage",
      message: "Missing required fields",
    });
  }

  await deleteStageById(req.params.id)
    .then((response) => {
      return res.sendStatus(204);
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Couldn't delete stage",
        message: error,
      });
    })
}

module.exports = {
  httpCreateNewStage,
  httpGetStagesByShipmentNumber,
  httpDeleteStage,
};
