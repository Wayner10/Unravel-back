const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const placesRouter = require("./src/routes/places");
const usersRouter = require("./src/routes/users");
const categoriesRouter = require("./src/routes/categories");
const regionsRouter = require("./src/routes/regions");
const reviewsRouter = require("./src/routes/reviews");
const place_typeRouter = require("./src/routes/other/Places_types");
const authRouter = require("./src/routes/auth");

const allowedOrigins = ['http://localhost:3000', 'https://unravel-front.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Manejar solicitudes preflight OPTIONS
app.options('*', cors());

app.use(express.json());

app.use("/api", placesRouter);
app.use("/api", usersRouter);
app.use("/api", categoriesRouter);
app.use("/api", regionsRouter);
app.use("/api", reviewsRouter);
app.use("/api", place_typeRouter);
app.use("/auth", authRouter);

// if (!process.env.RESEND_API_KEY) {
//   throw `Abort: You need to define RESEND_API_KEY in the .env file.`;
// }

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
