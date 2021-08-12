const yup = require('yup');
const config = require('../../config');

const createError = require('../createError');

const loginValidationSchema = yup.object().shape({
  username: yup.string().required().max(20, 'username_error'),
  password: yup.string().required().min(4).max(20, 'password_error'),
  aboutMe: yup.string().max(config.abouMe_length, 'aboutMe_length_error'),
});

const validateLoginCredentials = async ({ username, password, aboutMe }) => {
  try {
    await loginValidationSchema.validate(
      { username, password, aboutMe },
      {
        abortEarly: false,
      }
    );
  } catch (err) {
    throw createError(400, 'Bad Request', err.errors);
  }
};

module.exports = validateLoginCredentials;
