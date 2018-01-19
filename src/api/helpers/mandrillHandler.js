import mandrill from 'node-mandrill';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
} else {
  dotenv.config({ path: `${__dirname}/../../../.env.prod` });
}
const mandrillClient = mandrill(process.env.MANDRILL_API_KEY);
const templates = {
  'email-verification': ({ url }) => ({
    subject: 'Email Verification',
    html: `
      <h2>Welcome to CleanPower Pro</h2> <br>
      Click the following to verify your email <a href="${url}">${url}</a><br>
      If you have a problem, copy the url to your browser and go.
    `
  }),
  'reset-password': ({ url }) => ({
    subject: 'Reset Password',
    html: `
      <h2>Forgot your password?</h2> <br>
      Click the following to reset your password <a href="${url}">${url}</a><br>
      If you have a problem, copy the url to your browser and go.
    `
  })
};

const mandrillHandler = (req, res, { template, email, params }) => (err, data) => {
  const { subject, html } = templates[template](params);
  if (err) {
    res.send({
      error: err
    });
  } else {
    mandrillClient('/messages/send', {
      message: {
        to: [{email}],
        from_email: 'admin@cleanpower.pro',
        subject,
        html,
      }
    }, (error, response) => {
      if (error) {
        res.send({ error });
      } else {
        res.json(data);
      }
    });
  }
};

export default mandrillHandler;
