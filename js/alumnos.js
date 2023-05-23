
let identificador;

listar();

/*VALIDAR EL FORM*/
async function ValidarForm() {
    let inputAlumno = document.getElementById("inputAlumno").value;
    let inputLegajo = document.getElementById("inputLegajo").value;
     if (inputAlumno == "") {
       alert("El campo de Nombre y Apellido es obligatorio");
       return false;
     } else if (/\d/.test(inputAlumno)) {
       alert("El campo de Nombre y apellido no puede contener números");
       return false;
     }
   
     if (inputLegajo == "") {
       alert("El campo de Legajo es obligatorio");
       return false;
     } else if (!/^\d+$/.test(inputLegajo)) {
       alert("El campo de legajo solo puede contener números");
       return false;
     }
     return true;
    }
    
/*Añadir DATOS*/
async function agregarAlumno(){
  const inputAlumno = document.getElementById("inputAlumno");
  const inputLegajo = document.getElementById("inputLegajo");
  if (ValidarForm()) {
   try {
     response = await axios.post("http://localhost:3000/alumnos", {nombre: inputAlumno.value, legajo: inputLegajo.value});
     listar(); 
   } catch (error) {
     alert("Lo sentimos, se produjo un error. Intentelo nuevamente");
     console.log(error)
   }
   alert("Alumno agregado con éxito");
 }
 }

 /*Lista de ALUMNOS*/
 const lista = document.getElementById("lista"); 
  async function listar(){
   try{
     response = await axios.get("http://localhost:3000/alumnos")
     lista.innerHTML = ""; 
     response.data.forEach(element => {
         lista.innerHTML +=
          "<br>" + ` <span>- Alumno: ${element.nombre}` + ` <span> — Legajo: ${element.legajo}` +
         //Botón Editar
         '<button type="button" class="btn btn-success" id="btnEditarAlumno" onclick="actualizarAlumno('+ element.id +')">Editar</button>' +
         //Botón borrar
         '<button type="button" class="btn btn-danger" id="btnBorrarAlumno" onclick="borrarAlumno('+ element.id +')">Borrar</button>' +'<hr>'
         "<br>"
     }); 
     
   }catch(error){
     alert("Lo sentimos, se produjo un error. Intentelo nuevamente");
     console.log(error)
   }
  }

  /*BORRAR UN ALUMNO*/
  async function borrarAlumno(id){
    if (confirm("¿Está seguro de borrar al Alumno?")){
     try {
       response = await axios.delete("http://localhost:3000/alumnos/" + id)
       alert("El Alumno se borró con éxito");  
   } catch (error) {
       alert("Lo sentimos, se produjo un error. Intentelo nuevamente")
   }
   alert("El alumno se borró con éxito");
    }
}

/*MODIFICAR UN ALUMNO*/
async function actualizarAlumno(id){
 try {
     identificador = id
     response = await axios.get("http://localhost:3000/alumnos/" + id)
     inputAlumno.value = response.data.nombre;
     inputLegajo.value = response.data.legajo;
     btnModificarAlumno.hidden = false
     btnAgregarAlumno.hidden = true
 } catch (error) {
     alert("Lo sentimos, se produjo un error. Intentelo nuevamente")
     console.log(error)
 }
}


async function editarAlumno(){
 try {
   response = await axios.put("http://localhost:3000/alumnos/" + identificador, {nombre: inputAlumno.value,  legajo: inputLegajo.value})
} catch (error) {
   alert("Lo sentimos, se produjo un error. Intentelo nuevamente")
   console.log(error)
}
alert("El alumno se modificó con éxitos")
}




