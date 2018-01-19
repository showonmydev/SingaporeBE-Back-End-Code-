import mongoose from 'mongoose';
import responseHandler from '../helpers/responseHandler';

const Task = mongoose.model('Tasks');

/**
 * @route GET /tasks
 * @group Task - Operations about tasks
 * @returns {object} 200 - An array of tasks info
 * @returns {Error}  default - Unexpected error
 */
const list = (req, res) => {
  Task.find({}, responseHandler(req, res));
};

/**
 * @route POST /tasks
 * @group Task - Operations about tasks
 * @param {object} body.body - task name
 * @returns {object} 201 - A task info
 * @returns {Error}  default - Unexpected error
 */
const create = (req, res) => {
  const newTask = new Task(req.body);
  newTask.save(responseHandler(req, res));
};

/**
 * @route GET /tasks/{id}
 * @group Task - Operations about tasks
 * @param {string} id.path.required - task id
 * @returns {object} 200 - A task info
 * @returns {Error}  default - Unexpected error
 */
const read = (req, res) => {
  Task.findById(req.params.id, responseHandler(req, res));
};

/**
 * @route PUT /tasks/{id}
 * @group Task - Operations about tasks
 * @param {id} id.path.required - task id
 * @param {object} body.body - task name
 * @returns {object} 200 - A task info
 * @returns {Error}  default - Unexpected error
 */
const update = (req, res) => {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, responseHandler(req, res));
};

/**
 * @route DELETE /tasks/{id}
 * @group Task - Operations about tasks
 * @param {id} id.path.required - task id
 * @returns {object} 200 - A task info
 * @returns {Error}  default - Unexpected error
 */
const remove = (req, res) => {
  Task.remove({
    _id: req.params.taskId
  }, (err, task) => {
    if (err) res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

export default {
  list,
  create,
  read,
  update,
  remove,
};
