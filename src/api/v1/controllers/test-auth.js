const handle = (_req, res) => {
  res.status(200).send("Authorized");
};

module.exports = { handle };
