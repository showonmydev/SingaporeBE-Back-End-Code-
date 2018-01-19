const authRoutes = (app, controller) => {
  // auth Routes
  app.route('/auth/signin')
    .post(controller.signin);
  app.route('/auth/signup')
    .post(controller.signup);
  app.route('/auth/signup-verify')
    .post(controller.signupVerify);
  app.route('/auth/send-reset-password-link')
    .post(controller.sendResetPasswordLink);
  app.route('/auth/reset-password')
    .post(controller.resetPassword);
};

export default authRoutes;
