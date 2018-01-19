const responseHandler = (req, res) => (err, data) => {
  if (err) {
    res.send({ error: err });
  } else {
    res.json(data);
  }
};

export default responseHandler;
