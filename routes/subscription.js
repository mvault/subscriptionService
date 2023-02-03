const express = require("express");
const validation = require("../middlewares/validation");
const schemas = require("../helpers/schemas");
const subscriptionHelper = require("../helpers/subscription");

const app = express();

app.post("/", validation(schemas.subscription), async (req, res) => {
  const data = req.body;
  // need to add role check (admin, user, manager)
  // dashboard
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else if (res.locals.user.role === "customer") {
    data.customer = res.locals.roles._id
    data.company = res.locals.roles.company
  } else {
    // marketplace
    if (data.customer) {
      data.customer = data.customer
    } else {
      // create customer 
      data.customer = data.customer
    }
  }
  await subscriptionHelper.create(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/", async (req, res) => {
  const data = req.body;
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else if (res.locals.user.role === "customer") {
    data.customer = res.locals.roles._id
    data.company = res.locals.roles.company
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.update(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/activate", async (req, res) => {
  const data = req.body;
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.activate(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/billing", async (req, res) => {
  const data = req.body;
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else if (res.locals.user.role === "customer") {
    data.customer = res.locals.roles._id
    data.company = res.locals.roles.company
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.update(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/renew", async (req, res) => {
  const data = req.body;
  // need to add role check
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else if (res.locals.user.role === "customer") {
    data.customer = res.locals.roles._id
    data.company = res.locals.roles.company
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.update(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/upgrade", async (req, res) => {
  const data = req.body;
  // need to add role check
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else if (res.locals.user.role === "customer") {
    data.customer = res.locals.roles._id
    data.company = res.locals.roles.company
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.upgradePlan(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/cancel", async (req, res) => {
  const data = req.body;
  // need to add role check
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.cancel(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.patch("/status", async (req, res) => {
  const data = req.body;
  // need to add role check
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.upadateStatus(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

app.delete("/", async (req, res) => {
  const data = req.query;
  // need to add role check
  if (res.locals.user.role === "admin") {
    data.customer = data.customer
    data.company = res.locals.roles.company
  } else if (res.locals.user.role === "manager") {
    data.customer = data.customer
    data.company = res.locals.roles.company
    data.location = res.locals.roles.location
  } else {
    return res.status(400).send(res.locals.response = {status: 400, code: "unauthorized", message: "Unauthorized"});
  }
  await subscriptionHelper.delete(data).then((result) => {
    return res.status(200).send(res.locals.response = {status: 200, result});
  }).catch((err) => {
    return res.status(err.status || 400).send(res.locals.response = {status: err.status || 400, code: err.code, message: err.message});
  });
});

module.exports = router;