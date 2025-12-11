import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { color, bgcolor } from '../lib/color.js';
import { searchFilm } from '../lib/stream.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __path = process.cwd();

const router = express.Router();

router.get('/film/search', async (req, res, next) => {
  const { query, page = 1 } = req.query
  const data = await searchFilm(query, page)
  res.json(data)
})

export default router;