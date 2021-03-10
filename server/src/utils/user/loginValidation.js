const yup = require('yup');

const createError = require('../createError');

const loginValidationSchema = yup.object().shape({
  username: yup.string().required().max(20),
  password: yup.string().required().min(4).max(20),
});

const validateLoginCredentials = async ({ username, password }) => {
  try {
    await loginValidationSchema.validate(
      { username, password },
      {
        abortEarly: false,
      }
    );
  } catch (err) {
    throw createError(400, 'Bad Request', err.errors);
  }
};

module.exports = validateLoginCredentials;
