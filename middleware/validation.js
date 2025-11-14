
const validator = require('../helpers/validate');

const saveMovie = (req, res, next) => {
  const rules = {
    title: "required|string",
    directorId: "required|string",
    genre: "required|string",
    releaseYear: "required|integer|min:1888",
    duration: "required|integer|min:1",
    language: "required|string",
    rating: "numeric|min:0|max:10",
    synopsis: "string",
    cast: "array"
  };

  validator(req.body, rules, {}, (err, status) => {
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err
      });
    }
    next();
  });
};

module.exports = {
  saveMovie
};
