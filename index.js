const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv"); // Importar dotenv para las variables de entorno

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 4000;

const placesRouter = require("./src/routes/places");
const usersRouter = require("./src/routes/users");
const categoriesRouter = require("./src/routes/categories");
const regionsRouter = require("./src/routes/regions");
const reviewsRouter = require("./src/routes/reviews");
const place_typeRouter = require("./src/routes/other/Places_types");
const authRouter = require("./src/routes/auth"); 

// Configurar CORS solo para Vercel
app.use(cors({
  origin: 'https://unravel-front.vercel.app', // Solo se permite este origen
  optionsSuccessStatus: 200 // Para algunos navegadores antiguos que tienen problemas con respuestas 204
}));

app.use(express.json()); // Middleware para analizar cuerpos JSON

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use("/api", placesRouter);
app.use("/api", usersRouter);
app.use("/api", categoriesRouter);
app.use("/api", regionsRouter);
app.use("/api", reviewsRouter);
app.use("/api", place_typeRouter);
app.use("/auth", authRouter); 

// Verificar la clave de la API antes de iniciar el servidor
if (!process.env.RESEND_API_KEY) {
  throw `Abort: You need to define RESEND_API_KEY in the .env file.`;
}

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
