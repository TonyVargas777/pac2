
function recibirSeries() {
  fetch("series")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let series = "";
      for (let i = 0; i < data.length; i++) {
        print += `
          <div class="card serie-card">
            <button class="buttonCard" onclick="videoSerie(event, ${i})">
              <input type="hidden" class="serie-titulo" name="videoSerie" value="${data[i].titulo}">
              <img src="${data[i].imagen}" alt="${data[i].titulo}">
            </button>
            <div class="ficha">
              <h2>${data[i].titulo}</h2>
              <p>Plataforma: ${data[i].plataforma}</p>
              <p>Año: ${data[i].anyo}</p>
              <p>Descripción: ${data[i].descripcion}</p>
              <p>Nota: ${data[i].nota}</p>
              <input type="hidden" class="serie-titulo" name="borrarSerie" value="${data[i].titulo}">
              <button onclick="borrarSerie(event)">Borrar ❌</button>
            </div>
          </div>
        `;
      }
      

      // USO DEL DOM. ¿QUÉ HAGO AQUÍ? IMPRIMO DESDE EL JS AL HTML
      document.getElementById("print").innerHTML = series;
    });
}

function buscar() {
  const contenido = document.getElementById("serieBuscar").value;
  const data = {
    contenido: contenido,
  };

  fetch("series/contenido?contenido=" + contenido, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let print = "";
      for (let i = 0; i < data.length; i++) {
        print += `
          <div class="card serie-card">
            <button class="buttonCard" onclick="videoSerie(event, ${i})">
              <input type="hidden" class="serie-titulo" name="videoSerie" value="${data[i].titulo}">
              <img src="${data[i].imagen}" alt="${data[i].titulo}">
            </button>
            <div class="ficha">
              <h2>${data[i].titulo}</h2>
              <p>Plataforma: ${data[i].plataforma}</p>
              <p>Año: ${data[i].anyo}</p>
              <p>Descripción: ${data[i].descripcion}</p>
              <p>Nota: ${data[i].nota}</p>
              <input type="hidden" class="serie-titulo" name="borrarSerie" value="${data[i].titulo}">
              <button onclick="borrarSerie(event)">Borrar ❌</button>
            </div>
          </div>
        `;
      }
      
      document.getElementById("print").innerHTML = print;
    });
}

function insertar() {
  const titulo = document.getElementById("tituloInsertar").value;
  const plataforma = document.getElementById("plataformaInsertar").value;
  const anyo = document.getElementById("anyoInsertar").value;
  const descripcion = document.getElementById("descripcionInsertar").value;
  const nota = parseInt(document.getElementById("notaInsertar").value);
  const imagen = document.getElementById("imagenInsertar").value;
  const video = document.getElementById("videoInsertar").value;

  const serieInsertar = {
    titulo,
    plataforma,
    anyo,
    descripcion,
    nota,
    imagen,
    video,
  };

  fetch("nuevaSerie/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serieInsertar),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);      
    });
    buscar();
}

function editar() {
  const titulo = document.getElementById("tituloEditar").value;
  const plataforma = document.getElementById("plataformaEditar").value;
  const anyo = document.getElementById("anyoEditar").value;
  const descripcion = document.getElementById("descripcionEditar").value;
  const nota = parseInt(document.getElementById("notaEditar").value);
  const imagen = document.getElementById("imagenEditar").value;
  const video = document.getElementById("videoEditar").value;

  const nuevo = {titulo, plataforma, anyo, descripcion, nota, imagen, video,};

  fetch("/editarSerie", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevo),
  }) 
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);      
  });
}


function borrarSerie(event) {
  let button = event.target;
  let card = button.parentNode;
  let titulo = card.querySelector("input[name='borrarSerie']").value;

  let nuevo = {
    titulo: titulo,
  };

  fetch("/series", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevo),
  });
  buscar();
}

function videoSerie(event, index) {
  let button = event.target;
  let card = button.closest(".serie-card");
  let titulo = card.querySelector(".serie-titulo").textContent;

  fetch("/series?titulo=" + titulo)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let videoUrl = data[index].video;
      let windowFeatures = "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=500,height=300";
      window.open(videoUrl, "_blank", windowFeatures);
    });
}

