
const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

function directorsCollection() {
  return mongodb.getDatabase().collection('directors');
}

// GET ALL
const getAllDirectors = async (req, res) => {
  try {
    const directors = await directorsCollection().find().toArray();
    res.status(200).json(directors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching directors', error: error.message });
  }
};

// GET BY ID
const getDirectorById = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid director ID' });
    }

    const director = await directorsCollection().findOne({ _id: new ObjectId(id) });

    if (!director) {
      return res.status(404).json({ message: 'Director not found' });
    }

    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching director', error: error.message });
  }
};

// POST
const createDirector = async (req, res) => {
  try {
    const payload = { ...req.body };
    const result = await directorsCollection().insertOne(payload);

    res.status(201).json({ message: 'Director created', directorId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating director', error: error.message });
  }
};

// PUT
const updateDirector = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid director ID' });
    }

    const payload = { ...req.body };
    if (payload._id) delete payload._id;

    const result = await directorsCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }

    res.status(200).json({ message: 'Director updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating director', error: error.message });
  }
};

// DELETE
const deleteDirector = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid director ID' });
    }

    const result = await directorsCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }

    res.status(200).json({ message: 'Director deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting director', error: error.message });
  }
};

module.exports = {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector
};
