const express = require("express");
const validation = require("../middlewares/validation");
const schemas = require("../helpers/schemas");

const app = express();

/* POST home page. */
app.post("/", validation(schemas.subscription), async (req, res) => {
  const data = req.body;
});

app.patch("/", async (req, res) => {
  const data = req.body;
});

app.delete("/", async (req, res) => {
  const data = req.body;
});

module.exports = router;