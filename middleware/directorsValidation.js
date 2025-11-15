const validator = require('../helpers/validate');

const saveDirector = (req, res, next) => {
  const rules = {
    name: "required|string",
    birthYear: "required|integer|min:1850",
    nationality: "required|string"
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
  saveDirector
};
