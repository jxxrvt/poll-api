const express = require("express");
const router = express.Router();
const services = require("./services");
const { createPollSchema, voteSchema } = require("./schemas");
const db = require("../db/mongodb");
const { options } = require("joi");
const mongodb = require("../db/mongodb");

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

  value.options = value.options.map((opt) => {
    return {
      option: opt,
      count: 0,
    };
  });

  const collection = await db
    .getDB()
    .collection(db.pollsCollection)
    .insertOne(value);

  res.status(201).json("created");
});

// /polls/:id/vote
router.post("/:id/vote", async (req, res) => {
  const pollId = req.params.id;
  const { option } = req.body;

  // Validação do schema
  const { error } = voteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  // Buscar a poll pelo ID
  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }

  // Verificar se a opção existe
  const optionIndex = poll.options.findIndex((opt) => opt.option === option);
  if (optionIndex === -1) {
    return res.status(404).json({ error: "Option not found" });
  }

  // Atualizar a poll no banco de dados
  const updateResult = await db
    .getDB()
    .collection(db.pollsCollection)
    .updateOne(
      { _id: db.toMongoID(pollId), "options.option": option },
      { $inc: { "options.$.count": 1 } }
    );

  if (updateResult === 0) {
    return res.status(500).json({ error: "Failed to update poll" });
  }

  res.status(200).json({ message: "Vote successfully cast" });
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
