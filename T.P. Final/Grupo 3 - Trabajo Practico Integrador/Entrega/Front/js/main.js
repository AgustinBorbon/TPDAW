const URL = "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre"

var token

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