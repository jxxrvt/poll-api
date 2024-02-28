const express = require("express");
const router = express.Router();
const services = require("./services");
const { createPollSchema } = require("./schemas");
const db = require("../db/mongodb");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

router.get("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "not found" });
  }

  res.status(200).json(poll);
});

router.post("/", async (req, res) => {
  const { value, error } = createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  const collection = await db
    .getDB()
    .collection(db.pollsCollection)
    .insertOne(value);

  res.status(201).json("created");
});

router.delete("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const deleted = await services.deletePollById(pollId);
  if (!deleted) {
    return res.status(500).json({ error: "failed to delete poll" });
  }

  res.status(200).json({ message: "poll deleted successfully" });
});

module.exports = router;
