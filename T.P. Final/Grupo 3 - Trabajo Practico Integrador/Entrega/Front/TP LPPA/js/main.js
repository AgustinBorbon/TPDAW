const URL = "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre"

var token

/*
function login(){
    let userName = document.getElementById('nombre');
    let password = document.getElementById('contraseña')
    fetch(URL, userName)
    .then(data=> {
        var passwordsql =  data.password
        if (password = paswordsql)
        token = data.token
    })
}
*/

/*
function login(usuario, contraseña){
    // Llamas a la API con un user y PW y la API te devuelve un token 
    fetch(URL,{} )
    .then(Response => Response.json)
    .then(data => {
        var username = data.usuario
        var password = data.contraseña
    })

    var acceso = false;  //Dejo un flag denegando el acceso 
    
    if (username == usuario && password == contraseña) //Valido las credenciales
    acceso = true; //Modifico el flag para permitir acceso
    
    }
*/

    /*
    for(var i=0; i <listausuarios.length;i++)
    if(username == listausuarios[i][U] && contraseña == listausuarios[i][C]) /* en U y en C va la posicion del vector en la que estan los datos */ /*
    {
        acceso = true
    }
    */



const myHeaders = new Headers();

var tokensaved = 
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', 'token');

fetch(URL,  {
    method: 'GET',
    headers: myHeaders,
  })
.then(Response => Response.json())
.then(data => {
    var p = data.provincias
    console.log(p);
    for (let index = 0; index < p.length; index++) {
        console.log(p[index]);
        const element = p[index];
        var name_element = document.createElement('p')
        name_element.innerText = 'Nombre: '+element.id; 
        var lastname_element = document.createElement('p')
        lastname_element.innerText = 'Apellido: '+element.nombre; 
        var container = document.getElementById('container');
        //provincia = element.id;
        container.appendChild(name_element);
        container.appendChild(lastname_element);
    }
})


function create(){
    var rol = document.getElementById('rol-names')
    var userName = document.getElementById('nombre')
    var password = document.createElement('contraseña')

    var details = {
        method : "POST",
        body: {
            "rol": rol.value,
            "userName" : userName.value,
           "password" : password
        }
    }
    fetch(URL,details)
}
//<p>Nombre: <span id="nombre"></span></p>
//<p>Apellido: <span id="apellido"></span></p>

function Delete(){
    var rol = document.getElementById('rol-names')
    var userName = document.getElementById('nombre')
    var password = document.createElement('contraseña')

    var details = {
        method : "DELETE",
        body: {
            "rol": rol.value,
            "userName" : userName.value,
           "password" : password
        }
    }
    fetch(URL,details)
}


function update(){
    var rol = document.getElementById('rol-names')
    var userName = document.getElementById('nombre')
    var password = document.createElement('contraseña')

    var details = {
        method : "PUT",
        body: {
            "rol": rol.value,
            "userName" : userName.value,
           "password" : password
        }
    }
    fetch(URL,details)
}