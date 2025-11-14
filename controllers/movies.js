// // controllers/movies.js
// const { ObjectId } = require('mongodb');
// const mongodb = require('../data/database');

// // GET all movies
// const getAllMovies = async (req, res) => {
//   try {
//     const db = mongodb.getDatabase().collection('movies');
//     const movies = await db.find().toArray();

//     res.status(200).json(movies);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching movies", error });
//   }
// };

// // GET movie by ID
// const getMovieById = async (req, res) => {
//   try {
//     const movieId = req.params.id;

//     if (!ObjectId.isValid(movieId)) {
//       return res.status(400).json({ message: "Invalid movie ID" });
//     }

//     const db = mongodb.getDatabase().collection('movies');
//     const movie = await db.findOne({ _id: new ObjectId(movieId) });

//     if (!movie) {
//       return res.status(404).json({ message: "Movie not found" });
//     }

//     res.status(200).json(movie);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching movie", error });
//   }
// };

// // POST create movie
// const createMovie = async (req, res) => {
//   try {
//     const movie = req.body;

//     const db = mongodb.getDatabase().collection('movies');
//     const result = await db.insertOne(movie);

//     res.status(201).json({
//       message: "Movie created successfully",
//       movieId: result.insertedId
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating movie", error });
//   }
// };

// // PUT update movie
// const updateMovie = async (req, res) => {
//   try {
//     const movieId = req.params.id;

//     if (!ObjectId.isValid(movieId)) {
//       return res.status(400).json({ message: "Invalid movie ID" });
//     }

//     const db = mongodb.getDatabase().collection('movies');

//     const result = await db.replaceOne(
//       { _id: new ObjectId(movieId) },
//       req.body
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: "Movie not found" });
//     }

//     res.status(200).json({ message: "Movie updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating movie", error });
//   }
// };

// // DELETE movie
// const deleteMovie = async (req, res) => {
//   try {
//     const movieId = req.params.id;

//     if (!ObjectId.isValid(movieId)) {
//       return res.status(400).json({ message: "Invalid movie ID" });
//     }

//     const db = mongodb.getDatabase().collection('movies');

//     const result = await db.deleteOne({ _id: new ObjectId(movieId) });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "Movie not found" });
//     }

//     res.status(200).json({ message: "Movie deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting movie", error });
//   }
// };

// module.exports = {
//   getAllMovies,
//   getMovieById,
//   createMovie,
//   updateMovie,
//   deleteMovie
// };

// controllers/movies.js
const { ObjectId } = require('mongodb');
const mongodb = require('../data/database'); // debe exportar initDb y getDatabase()

// Helper para coger la colección
function moviesCollection() {
  return mongodb.getDatabase().collection('movies');
}

const getAllMovies = async (req, res) => {
  try {
    const movies = await moviesCollection().find().toArray();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching all movies:', error);
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    let movieId = req.params.id;
    if (!movieId) return res.status(400).json({ message: 'Movie id required' });
    movieId = movieId.trim(); // elimina espacios por si acaso

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const movie = await moviesCollection().findOne({ _id: new ObjectId(movieId) });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie by id:', error);
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const payload = { ...req.body };
    // no convertimos directorId a ObjectId aquí; si lo quieres, valida/convierte antes
    const result = await moviesCollection().insertOne(payload);
    res.status(201).json({ message: 'Movie created', movieId: result.insertedId });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Error creating movie', error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    let movieId = req.params.id;
    if (!movieId) return res.status(400).json({ message: 'Movie id required' });
    movieId = movieId.trim();

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const payload = { ...req.body };
    // opcional: no permitir que el body incluya _id
    if (payload._id) delete payload._id;

    // usar updateOne con $set para evitar reemplazar completamente el documento
    const result = await moviesCollection().updateOne(
      { _id: new ObjectId(movieId) },
      { $set: payload }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    let movieId = req.params.id;
    if (!movieId) return res.status(400).json({ message: 'Movie id required' });
    movieId = movieId.trim();

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const result = await moviesCollection().deleteOne({ _id: new ObjectId(movieId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
