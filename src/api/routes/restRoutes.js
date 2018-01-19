const restRoutes = (app, controller, modelName) => {

  // task Routes
  app.route(`/${modelName}`)
    .get(controller.list)
    .post(controller.create);

  app.route(`/${modelName}/:id`)
    .get(controller.read)
    .put(controller.update)
    .delete(controller.remove);
};

export default restRoutes;
