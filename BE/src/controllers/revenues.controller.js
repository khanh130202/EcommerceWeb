const revenuesService = require("../services/revenues.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function revenueDataChart(req, res, next) {
  try {
    const revenue = await revenuesService.revenueDataChart(req.body);
    return res.json(JSend.success({ revenue }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error get revenue`));
  }
}

module.exports = {
  revenueDataChart,
};
