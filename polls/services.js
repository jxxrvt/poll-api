const db = require("../db/mongodb");

async function getPollById(pollId) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllPolls() {
  try {
    return await db.getDB().collection(db.pollsCollection).find({}).toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function vote(pollId, option) {
  // Verificar se a poll existe
  const poll = await db
    .getDB()
    .collection(db.pollsCollection)
    .getPollById(pollId);
  if (!poll) {
    return null; // Retorna null se a poll não for encontrada
  }

  // Verificar se a opção é válida
  const optionExists = poll.options.includes(option);
  if (!optionExists) {
    return null; // Retorna null se a opção não for válida
  }

  // Registrar o voto
  const voteResult = await db.registerVote(pollId, option);
  return voteResult; // Retorna o resultado da votação
}

async function registerVote(pollId, option) {

  const result = await Poll.updateOne(
    { _id: pollId, "options.option": option },
    { $inc: { "options.$.votes": 1 } }
  );
  return result;
}

async function deletePollById(pollId) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .deleteOne({ _id: db.toMongoID(pollId) });

    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  vote,
  registerVote,
  getPollById,
  getAllPolls,
  deletePollById,
};
