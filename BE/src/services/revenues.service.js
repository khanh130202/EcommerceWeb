const knex = require("../database/knex");
const moment = require("moment");

function orderItemRepository() {
  return knex("orderItems");
}

async function revenueDataChart(request) {
  const { startDate, endDate, UserID } = request;

  const salesData = await orderItemRepository()
    .from("orderitems as od")
    .modify((builder) => {
      if (UserID) {
        builder.where("p.CreatedBy", "=", UserID);
      }
    })
    .select(
      "o.CreatedAt AS date",
      knex.raw("SUM(od.Quantity * o.TotalAmount) AS totalSales")
    )
    .innerJoin("orders as o", "od.OrderID", "o.OrderID")
    .leftJoin("products as p", "od.ProductID", "p.ProductID")
    .where("o.IsDeleted", false)
    .andWhere("o.CreatedAt", ">=", startDate)
    .andWhere("o.CreatedAt", "<", endDate)
    .groupBy("date")
    .orderBy("date");

  const labels = salesData.map((sd) => moment(sd.date).format("YYYY-MM-DD"));
  const datasets = salesData.map((sd) => sd.totalSales);

  return {
    labels,
    datasets,
  };
}

module.exports = {
  revenueDataChart,
};
