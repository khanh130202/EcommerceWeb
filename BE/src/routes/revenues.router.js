const express = require("express");
const revenuesController = require("../controllers/revenues.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/revenues", router);
  
  router.post("/get-data-chart", authenticateToken, revenuesController.revenueDataChart);
};
