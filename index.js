import path from 'path';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import expressLayout from 'express-ejs-layouts';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import secure from 'ssl-express-www';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import helmet from 'helmet';
import csrf from 'csurf';
import { getMovies, filmInfo, getShows, getPopulate, searchFilm, getGenresById } from './lib/stream.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

import { color } from './lib/color.js';
import { verifyToken } from './middleware/index.js';
import apirouter from './routes/api.js';

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "https:"],
        "frame-src": ["'self'", "https:"],
        "img-src": ["'self'", "data:", "https:"],
      },
    },
  })
);
app.use(compression());

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW),
    max: Number(process.env.RATE_LIMIT_MAX),
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: false, message: 'Too many requests' },
  })
);

app.use(secure);
app.use(cors());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  next();
});

app.use((req, res, next) => {
  const dangerous = ['TRACE', 'TRACK', 'CONNECT'];
  if (dangerous.includes(req.method)) return res.status(405).send('Method Not Allowed');
  next();
});

app.set('view engine', 'ejs');
app.use(expressLayout);
app.set('views', path.join(__dirname, 'views'));
app.set('json spaces', 2);

app.use((req, res, next) => {
  const token = jwt.sign({ apikey: process.env.APIKEY }, process.env.SECRETKEY, { expiresIn: '1h' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000 // 1 jam
  });
  next();
});

// Homepage
app.get('/', async(req, res) => {
  app.disable('set-cookie');
  const data = await getMovies()
  const data2 = await getShows()
  const data3 = await getPopulate()
  res.render('index', {
    dataStream: data,
    showsStream: data2,
    populateStream: data3,
    layout: 'index',
  });
});

// watch Route
app.get('/watch/:type/:id/:season/:episode', verifyToken, async (req, res) => {
  const { id, type, season, episode } = req.params;
  const dataInfo = await filmInfo(id, type)
  res.render('watch', {
    streamData: dataInfo,
    type_media: type,
    url: {
      vidplus: `https://player.vidplus.to/embed/${type}/${id}/${season && episode ? season + '/' +episode : ''}?autoplay=true&poster=true&title=true&watchparty=false&chromecast=true&servericon=true&setting=true&pip=true&primarycolor=6C63FF&secondarycolor=9F9BFF&iconcolor=FFFFFF&logourl=https%3A%2F%2Fi.ibb.co%2F67wTJd9R%2Fpngimg-com-netflix-PNG11.png&font=Roboto&fontcolor=FFFFFF&fontsize=20&opacity=0.5`,
      videasy: `https://player.videasy.net/${type}/${id}`,
      vidrock: `https://vidrock.net/${type}/${id}/${season && episode ? season + '/' + episode : ''}`,
      vidsrc: `https://vidsrc-embed.ru/embed/${type}/${id}`,
    },
    layout: 'watch',
  });
});

app.get('/film/search', verifyToken, async (req, res) => {
  const { query, page } = req.query;
  let {results, total_pages, total_results} = await searchFilm(query, page||1)
  for (let item of results) {
    item.genres = await getGenresById(item.genre_ids);
}
  res.render('search', {
    currentPage: page||1,
    query,
    total_results,
    total_pages,
    results,
    layout: 'search',
  });
});

// API Router
app.use('/api', verifyToken, apirouter);

app.use((req, res) => {
  res.status(404).render('404err', { layout: '404err' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ status: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(color(`Server running on port ${PORT}`, 'green'));
});

export default app;
