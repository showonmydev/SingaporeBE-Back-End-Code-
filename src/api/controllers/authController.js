import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import mailchimp from 'mailchimp-v3';

import responseHandler from '../helpers/responseHandler';
import mandrillHandler from '../helpers/mandrillHandler';
import { validateWithProvider } from '../helpers/socialLogin';

// mailchimp.setApiKey(process.env.MAILCHIMP_API_KEY);
const User = mongoose.model('Users');

/**
 * @route POST /auth/signin
 * @group Auth - Operations about authentication
 * @param {object} body.body - { email, password }
 * @returns {object} 200 - success info
 * @returns {Error} default - Unexpected error
 */
const signin = (req, res) => {
  const { email, password, network, token } = req.body;
  const passwordHash = password && jwt.sign(`${email}-${password}`, process.env.SUPER_SECRET);
  if (network === 'facebook' || network === 'google') {
    validateWithProvider(network, token)
      .then(({ email, name, avatar }) => {
        User.findOne({ email, network }, (err, user) => {
          if (err || !user) {
            const passwordHash = jwt.sign(`${email}-${process.env.SUPER_SECRET}`, process.env.SUPER_SECRET);
            const newUser = new User({
              email,
              name,
              avatar,
              password: passwordHash,
              activated: true,
              network,
            });
            newUser.save(responseHandler(req, res));
          } else {
            res.json(user);
          }
        });
      })
      .catch(error => res.send(error));
  } else {
    User.findOne({ email, password: passwordHash, network: 'cleanpowerpro' }, (err, user) => {
      if (err) {
        res.send(err);
      } else if (!user) {
        res.send({
          error: {
            message: 'Invalid email/password.'
          }
        });
      } else if (user.activated === false) {
        res.send({
          error: {
            message: `Email is not verified. Please check your email(${email}) for activation link.`
          }
        });
      } else {
        res.json(user);
      }
    });
  }
};

/**
 * @route POST /auth/signup
 * @group Auth - Operations about authentication
 * @param {object} body.body - { email, password, username }
 * @returns {object} 201 - success info
 * @returns {Error} default - Unexpected error
 */
const signup = (req, res) => {
  const { email, password, username } = req.body;
  const passwordHash = password && jwt.sign(`${email}-${password}`, process.env.SUPER_SECRET);
  const newUser = new User({
    ...req.body,
    password: passwordHash,
    activated: false,
    network: 'cleanpowerpro'
  });
  const token = jwt.sign(email, process.env.SUPER_SECRET);
  const url = `${process.env.CLIENT_URL}/#/sign-up/verify-email/${token}`;
  // send an e-mail to a user
  newUser.save(mandrillHandler(req, res, {
    template: 'email-verification',
    email,
    params: { url }
  }));
};

/**
 * @route POST /auth/signup-verify
 * @group Auth - Operations about authentication
 * @param {object} body.body - { token }
 * @returns {object} 200 - success info
 * @returns {Error} default - Unexpected error
 */
const signupVerify = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.SUPER_SECRET, (err, email) => {
      if (err) {
        res.send({
          error: err
        });
      } else {
        User.findOne({ email }, (err, user) => {
          if (err) {
            res.send(err);
          } else if (!user) {
            res.send({
              error: {
                message: `A user(${email}) does not exist.`
              }
            });
          } else {
            const newUser = new User(user);
            newUser.activated = true;
            newUser.save(responseHandler(req, res));
          }
        });
      }
    });
  } else {
    res.send({
      error: {
        message: 'A token is not given.'
      }
    });
  }
};

/**
 * @route POST /auth/send-reset-password-link
 * @group Auth - Operations about authentication
 * @param {object} body.body - { email }
 * @returns {object} 200 - success info
 * @returns {Error} default - Unexpected error
 */
const sendResetPasswordLink = (req, res) => {
  const { email } = req.body;
  const token = jwt.sign(email, `${process.env.SUPER_SECRET}-reset-password`);
  const url = `${process.env.CLIENT_URL}/#/reset-password/${token}`;
  // send an e-mail to a user
  if (email) {
    User.findOne({ email }, (err, user) => {
      if (err) {
        res.send(err);
      } else if (!user) {
        res.send({
          error: {
            message: `A user(${email}) does not exist.`
          }
        });
      } else {
        mandrillHandler(req, res, {
          template: 'reset-password',
          email,
          params: { url }
        })(null, {
          success: true
        });
      }
    });
  } else {
    res.send({
      error: {
        message: 'An email is not given.'
      }
    });
  }
};

/**
 * @route POST /auth/reset-password
 * @group Auth - Operations about authentication
 * @param {object} body.body - { password }
 * @returns {object} 200 - success info
 * @returns {Error} default - Unexpected error
 */
const resetPassword = (req, res) => {
  const { token, password } = req.body;
  if (token) {
    jwt.verify(token, `${process.env.SUPER_SECRET}-reset-password`, (err, email) => {
      if (err) {
        res.send({
          error: err
        });
      } else {
        User.findOne({ email }, (err, user) => {
          if (err) {
            res.send(err);
          } else if (!user) {
            res.send({
              error: {
                message: `A user(${email}) does not exist.`
              }
            });
          } else {
            const newUser = new User(user);
            const passwordHash = password && jwt.sign(`${user.email}-${password}`, process.env.SUPER_SECRET);
            newUser.password = passwordHash;
            newUser.save(responseHandler(req, res));
          }
        });
      }
    });
  } else {
    res.send({
      error: {
        message: 'A token is not given.'
      }
    });
  }
};

export default {
  signin,
  signup,
  signupVerify,
  resetPassword,
  sendResetPasswordLink,
};
