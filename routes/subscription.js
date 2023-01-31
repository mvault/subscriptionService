const express = require("express");
const memeberHelper = require("../helpers/members");
const validation = require("../middlewares/validation");
const schemas = require("../helpers/schemas");
const app = express();

/* POST home page. */
app.post("/", validation(schemas.subscription), async (req, res) => {
  const data = req.body;
});

module.exports = router;