let identificador;
let estado;
listar();

/*VALIDAR EL FORM*/
function ValidarForm() {
   let inputLibro = document.getElementById("inputLibro").value;
   let inputAutor = document.getElementById("inputAutor").value;
    if (inputLibro == "") {
      alert("El campo de Agregar libro es obligatorio");
      return false;
    } else if (/\d/.test(inputLibro)) {
      alert("El campo de Agregar libro no puede contener números");
      return false;
    }
  
    if (inputAutor == "") {
      alert("El campo de Agregar libro es obligatorio");
      return false;
    } else if (/\d/.test(inputAutor)) {
      alert("El campo de Agregar libro no puede contener números");
      return false;
    }
    return true;
  }


  /*Añadir DATOS (libros) en el json*/
  async function guardar(){
   const inputLibro = document.getElementById("inputLibro");
   const inputAutor = document.getElementById("inputAutor");
   if(ValidarForm()){
try {
      response = await axios.post("http://localhost:3000/libros", {titulo: inputLibro.value, autor: inputAutor.value, prestado: estado});
      listar();

    } catch (error) {
      alert("Lo sentimos, se produjo un error. Intentelo nuevamente");
      console.log(error)
    }
    alert("El libro fue añadido con éxito");
   }
    
  }

  /*Lista de LIBROS donde los muestro*/
  const lista = document.getElementById("lista"); 
   async function listar(){
    try{
      response = await axios.get("http://localhost:3000/libros")
      lista.innerHTML = ""; 
      response.data.forEach(element => {

         if(element.prestado){
          lista.innerHTML +=
           "<br>" + ` <span>- Libro: ${element.titulo}` + ` <span> ( ${element.autor})` + " "+ '<strong>— PRESTADO.</strong>' +
          //Botón Editar
          '<button type="button" class="btn btn-success" id="btnEditar" onclick="actualizar('+ element.id +')">Editar</button>' +
          //Botón borrar
          '<button type="button" class="btn btn-danger" id="btnBorrar" onclick="borrar('+ element.id +')">Borrar</button>' +'<hr>'
          "<br>"
         } else{
          lista.innerHTML +=
          "<br>" + ` <span>- Libro: ${element.titulo}` + ` <span> ( ${element.autor})` + " "+ '<strong>— DISPONIBLE.</strong>' +
         //Botón Editar
         '<button type="button" class="btn btn-success" id="btnEditar" onclick="actualizar('+ element.id +')">Editar</button>' +
         //Botón borrar
         '<button type="button" class="btn btn-danger" id="btnBorrar" onclick="borrar('+ element.id +')">Borrar</button>' +'<hr>'
         "<br>"
         }
          
      }); 
      
    }catch(error){
      alert("Lo sentimos, se produjo un error. Intentelo nuevamente");
      console.log(error)
    }
   }

   //BORRAR datos (libros) del json
function borrar(id){
  if(confirm("¿Está seguro de borrar el libro?")){
     let endpoint = "http://localhost:3000/libros/"+id
     axios.get(endpoint)
    .then(function(resultado){
      //CONDICION PARA QUE NO SE BORRE UN LIBRO QUE FUE PRESTADO
      if(!resultado.data.prestado){
          axios.delete(endpoint)
          .then(function(){
          })
          alert("Libro borrado con éxito")
      }
      else
      alert("No se puede eliminar un libro prestado")
  })
  }
 
}



/*MODIFICAR UN DATO (LIBRO) aquí trae los datos que serán actualizados*/
async function actualizar(id){
  try {
      identificador = id
      response = await axios.get("http://localhost:3000/libros/" + id)
      inputLibro.value = response.data.titulo;
      inputAutor.value = response.data.autor;
      estado = response.data.prestado;
      btnModificar.hidden = false
      btnGuardar.hidden = true
  } catch (error) {
      alert("Lo sentimos, se produjo un error. Intentelo nuevamente")
      console.log(error)
  }
}

 //MODIFICAR el libro en el json después de traer los datos.
async function editar(){
  try {
    response = await axios.put("http://localhost:3000/libros/" + identificador, {titulo: inputLibro.value,  autor: inputAutor.value, prestado: estado})
} catch (error) {
    alert("Lo sentimos, se produjo un error. Intentelo nuevamente")
    console.log(error)
}
alert("El libro se modificó con éxito")
}

async function alumnoDeuda(id){
  let auxDeuda;
  try {
    response = await axios.get("http://localhost:3000/prestamos/")
    response.data.forEach(element =>{
      if(element.alumnoId == id && element.fechaDevolucion == ""){
        auxDeuda = true;
      }else{
        auxDeuda = false;
      }
    })
    if(auxDeuda){
      alert("No se puede borrar un libro que fue prestado")
    }else{
      borrar(id)
    }
  } catch (error) {
    alert("Lo siento. Intentelo de nuevo")
    console.log(error);
  }
}