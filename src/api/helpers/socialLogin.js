import request from 'request';

const providers = {
  facebook: {
    url: 'https://graph.facebook.com/me',
    qs: token => ({ access_token: token, fields: 'name,email,picture' }),
    profile: response => ({ name: response.name, email: response.email, avatar: response.picture.data.url })
  },
  google: {
    url: 'https://www.googleapis.com/plus/v1/people/me',
    qs: token => ({ access_token: token }),
    profile: response => ({ name: response.displayName, email: response.emails[0].value, avatar: response.image.url })
  },
  defaultProvider: {
    qs: () => {},
    profile: () => {}
  }
};

export const validateWithProvider = (network, token) =>
  new Promise((resolve, reject) => {
    // Send a GET request to Facebook with the token as query string
    const provider = providers[network] || providers.defaultProvider;
    request({
      url: provider.url,
      qs: provider.qs(token)
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(provider.profile(JSON.parse(body)));
      } else {
        reject(error || JSON.parse(body));
      }
    });
  });

export default validateWithProvider;
