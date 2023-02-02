const express = require("express");
const validation = require("../middlewares/validation");
const schemas = require("../helpers/schemas");
const subscriptionHelper = require("../helpers/subscription");

const app = express();

/* POST home page. */
app.post("/", validation(schemas.subscription), async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.create(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.update(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/billing", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.update(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/renew", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.update(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/upgrade", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.upgradePlan(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/downgrade", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.downgradePlan(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/cancel", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.cancel(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/status", async (req, res) => {
  const data = req.body;
  // need to add role check
  await subscriptionHelper.upadateStatus(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.delete("/", async (req, res) => {
  const data = req.query;
  // need to add role check
  await subscriptionHelper.delete(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

module.exports = router;