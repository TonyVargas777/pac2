const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ELEMENTOS PARA CONECTAR CON MONGODB
// SIEMPRE IGUALES. DOS FORMAS.
// MONGOOSE Y MONGO CLIENT. EMPEZAMOS CON MC POR ESTABILIDAD.

const mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;

// CONEXIÓN CON MONGODB VÍA MONGO CLIENT

MongoClient.connect("mongodb://0.0.0.0:27017/", function (err, client) {
  if (err != null) {
    console.log(err);
    console.log("No se ha podido conectar con MongoDB");
  } else {
    app.locals.db = client.db("basetelevision");
    console.log("Conexión correcta a la base de datos television de MongoDB");
  }
});

// RUTAS
app.get("/series", mostrarSeries);
app.post("/nuevaSerie", añadirSerie);
app.post("/series/contenido", buscarSerie);
/* app.put("/editarSerie", editarSerie); */
/* app.delete("/series", eliminarSerie) */

// CONTROLADOR - VER TODAS LAS SERIES
/* app.get("/series/:id", function (req, res) { */
function mostrarSeries(req, res) {
  app.locals.db
    .collection("series")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      /* console.log(result); */
      res.send(result);
    });
}
/* }); */

// CONTROLADOR - AÑADIR SERIE
function añadirSerie(req, res) {
  const serie = {
    titulo: req.body.titulo,
    plataforma: req.body.plataforma,
    anyo: req.body.anyo,
    descripcion: req.body.descripcion,
    nota: req.body.nota,
    imagen: req.body.imagen,
    video: req.body.video,
  };
  app.locals.db.collection("series").insertOne(serie, function (err, res) {
    if (err) throw err;
    console.log("1 documento insertado");
  });
  res.redirect("/series");
}

// CONTROLADOR - BUSCAR SERIES POR TITULO, DESCRIPCION O PLATAFORMA

function buscarSerie(req, res) {
  const contenido = req.query.contenido; // Utilizar req.query en lugar de req.params
  console.log(contenido);
  app.locals.db
    .collection("series")
    .find({
      $or: [
        { titulo: { $regex: contenido, $options: "i" } },
        { descripcion: { $regex: contenido, $options: "i" } },
        { plataforma: { $regex: contenido, $options: "i" } },
      ],
    })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
}

// EDITAR SERIE
app.put("/editarSerie",  (req, res) =>{
function editarSerie(req, res) {
  const titulo = req.params.titulo;
  const nuevo = {
    titulo: req.body.titulo,
    plataforma: req.body.plataforma,
    anyo: req.body.anyo,
    descripcion: req.body.descripcion,
    nota: req.body.nota,
    imagen: req.body.imagen,
    video: req.body.video,
  }

  app.locals.db.collection("series").updateOne(
    { titulo: titulo },
    { $set: nuevo },
    function (err, result) {
      if (err) {
        throw err;
      }
      console.log("Serie editada");
      res.json(nuevo);
    }
  );
}});


// BORRAR SERIE
// function eliminarSerie()
app.delete("/series", (req, res) => {
  let titulo = req.body.titulo;
  console.log(titulo);
  app.locals.db.collection("series").deleteOne({ titulo: titulo }, function(err, result) {
    if (err) throw err;
    console.log("Serie eliminada");
    res.send(titulo);
  });
});


// PUERTO

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});
