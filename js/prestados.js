let sLibros = document.getElementById("sLibros");
let sAlumnos = document.getElementById("sAlumnos");
let lista = document.getElementById("lista");

listar();
mostrarTodosLibros();
mostrarAlumnos();

//listar los libros en la lista
async function listar(){
  try{
    response = await axios.get("http://localhost:3000/prestamos")
    lista.innerHTML = ""; 
    response.data. reverse().forEach(async (element) => {
      let alumno;
      let libro;
      alumno = await getAlumno(element.alumnoId)
      libro = await getLibro(element.libroId)

      if(element.fechaDevolucion == ""){
        lista.innerHTML +=
        '<button class="btn btn-success" id= "btnDevolver" onclick="devolver('+element.id+')">Devolver</button>' + " " + alumno + ", " + libro + ". " + element.fechaEntrega+ " - " + element.fechaDevolucion+ " " + "<hr>"
      }
      else{
        lista.innerHTML +=
        '<button class="btn btn-danger disabled" id="btnDevuelto">DEVUELTO</button>' + " " + alumno + ", " + libro + ". " + element.fechaEntrega+ " - " + element.fechaDevolucion+ " " + "<hr>"
      }
    }); 
    
  }catch(error){
    alert("Lo sentimos, se produjo un error. Intentelo nuevamente");
    console.log(error)
  }
 }

 //TRAE los datos del arreglo alumno del json por id
 async function getAlumno(id){
  resp = await axios.get("http://localhost:3000/alumnos/"+id)
  return resp.data.nombre
}

//TRAE los datos del arreglo de libros del json por id
async function getLibro(id){
  resp = await axios.get("http://localhost:3000/libros/"+id)
  return resp.data.titulo
}

//FUNCIÓN DE DEVOLVER (botón devolver creado en la lista) UN LIBRO trayendo los datos de prestamos por el id de alumno y libro.
  async function devolver(id) {
  const hoy = new Date()
  let endpoint = "http://localhost:3000/prestamos/" + id
  axios.get(endpoint)
  .then(async function(res){
      resp = await axios.put(endpoint, {alumnoId: res.data.alumnoId, libroId: res.data.libroId, fechaEntrega: res.data.fechaEntrega, fechaDevolucion: hoy.toLocaleDateString()})
      estadoPrestado(res.data.libroId, false)
  })
}

//Función para mostrar todos los libros en el select
async function mostrarTodosLibros(){
   const response = await axios.get("http://localhost:3000/libros")
   sLibros.innerHTML ="";
   response.data.forEach(element =>{
    if(!element.prestado)
    sLibros.innerHTML += '<option value="'+element.id+'">'+element.titulo+'</option>'

   })
}

//Función para mostrar todos los alumnos en el select
async function mostrarAlumnos(){
  const response = await axios.get("http://localhost:3000/alumnos")
   sAlumnos.innerHTML ="";
   response.data.forEach(element =>{
    sAlumnos.innerHTML += '<option value="'+element.id+'">'+element.nombre+'</option>'
   })
}

//FUNCIÓN de prestar, trayendo los datos de la función guardarPrestamo() y estadoPrestamo()
function prestar(){
  const hoy = new Date()

  let alumnoPrestamo = sAlumnos.options[sAlumnos.selectedIndex].value
  let libroPrestado = sLibros.options[sLibros.selectedIndex].value

  //nuevo prestamo, post
  //nuevo prestamo, date
  guardarPrestamo(alumnoPrestamo, libroPrestado, hoy)
  
  //cambiar estado prestado a libro, put
  estadoPrestado(libroPrestado, true)
  
}


function guardarPrestamo(pibe, librito, hoy) 
{
    axios.post("http://localhost:3000/prestamos/", {alumnoId: pibe, libroId: librito, fechaEntrega: hoy.toLocaleDateString(), fechaDevolucion:""})
    .then(function(resultado){
        alert("Libro prestado con éxito")
        listar()
    })
}

function estadoPrestado(id , estado) {
    
  let endpoint = "http://localhost:3000/libros/" + id
  axios.get(endpoint)
  .then(async function(res){
   axios.put("http://localhost:3000/libros/" +id,  {titulo: res.data.titulo, prestado: estado, autor: res.data.autor})
   .then(function(resp){})})
}

