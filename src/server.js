import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import './api/models'; // created model loading here
import routes from './api/routes/routes'; // importing route
import { setupSwagger } from './setup/swagger';
const dotenv = require('dotenv');

const basePath = '/api/v1';
const app = express();
app.use(cors());

const apis = express();
const port = process.env.PORT || 9000;

dotenv.load({ path: '.env-sample' });
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_OPEN_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(apis); // register the route
app.use(basePath, apis);

setupSwagger(app, process.env.API_HOST, basePath);
app.listen(port);

console.log(`test RESTful API server started on: ${port}`);
