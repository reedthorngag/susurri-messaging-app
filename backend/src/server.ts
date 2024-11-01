import express from 'express';
import path from 'path';
import cors from 'cors';
import { glob } from 'glob';
import Logger from './util/logger.js';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('etag', false);

export default app;
