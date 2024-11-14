const express = require("express");
const orderItemsController = require("../controllers/order-items.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/v1/orderitems", router);
  
  router.get("/", orderItemsController.getOrderItemsByFilter);

  router.post("/", authenticateToken, orderItemsController.createOrderItem);

  router.delete("/", authenticateToken, orderItemsController.deleteMultiOrderItems);

  router.get("/:OrderID", authenticateToken, orderItemsController.getOrderItemsByOrderId);

  router.put("/:id", authenticateToken, orderItemsController.updateOrderItem);

  router.delete("/:id", authenticateToken, orderItemsController.deleteOrderItem);
};
