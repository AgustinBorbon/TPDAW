const URL = "https://localhost:44344/api/UsersLogins?userName=fclarat&password=test"
    // Faltarian agregar mas URL de los endpoints para cada metodo
const myHeaders = new Headers();


//Login del usuario
function login() {
    // Llamas a la API con un user y PW y la API te devuelve un token
    var username = document.getElementById('nombre').value
    var password = document.getElementById('password').value
    var urlLogin = 'https://localhost:44344/api/UsersLogins?userName=' + username + '&password=' + password
    fetch(urlLogin, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data.token != undefined) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", data.userName)
                window.location.replace('abm.html');
            } else {
                document.getElementById('campoDeError').innerHTML = "El usuario o la contraseña son incorrectas"
            }


        })
        .catch(error => console.log(error))
}

// --------
var tokensaved = localStorage.getItem("token")
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', 'tokensaved');

//Crear Usuario
function create() { // Aca se utiliza el getelement o se lo pasa como parametro?
    var urlCreate = 'https://localhost:44344/api/UsersLogins/createUser'
    var rol = document.getElementById('rol-names').value
    var userName = document.getElementById('nombre').value
    var password = document.getElementById('password').value
    var tokensaved = localStorage.getItem("token")

    if (rol == 'admin') {
        rol = 1;
    } else {
        rol = 2;
    }


    let formData = new FormData();
    formData.append('rol', rol);
    formData.append('userName', userName);
    formData.append('password', password);

    fetch(urlCreate, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + tokensaved
            },
            body: formData
        }).then(Response => Response.json())
        .then(
            data => {
                document.getElementById('result').innerHTML = 'Usuario creado';
            }
        )
        .catch((error) => {
            document.getElementById('result').innerHTML = 'Usuario sin permisos';
        });
}

//Actualizar Usuario
function Update(id, rol) {
    var urlUpdate = 'https://localhost:44344/api/UsersLogins/editUser/' + id
    var tokensaved = localStorage.getItem("token")

    if (rol == 1) {
        rol = 2
    } else {
        rol = 1
    }

    let formData = new FormData();
    formData.append('rol', rol);

    fetch(urlUpdate, {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + tokensaved
            },
            body: formData
        }).then(Response => Response.json())
        .then(
            data => {
                getall();

            }

        )
        .catch((error) => {
            document.getElementById('result').innerHTML = 'Usuario sin permisos';
        });

}

//Eliminar Usuario
function Delete(id) {
    var urlDelete = 'https://localhost:44344/api/UsersLogins/deleteUser/' + id
    var tokensaved = localStorage.getItem("token")

    fetch(urlDelete, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + tokensaved
            }
        })
        .then(Response => Response.json())
        .then(
            data => {
                getall();
            }

        ).catch((error) => {
            document.getElementById('result').innerHTML = 'Usuario sin permisos';
        });
}

//Listar Usuarios
function getall() {
    var urlgetAll = 'https://localhost:44344/api/UsersLogins/GetAllUsers'
    var tokensaved = localStorage.getItem("token")

    fetch(urlgetAll, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokensaved
            }
        })
        .then(Response => Response.json())
        .then(
            data => {

                document.getElementById('result').innerHTML = '';

                testJson = data;
                var fila = '<table class="table"><tr><th>Usuario</th><th>Rol</th><th>intercambiar rol</th><th>Borrar</th>';
                for (let index = 0; index < testJson.length; index++) {

                    if (testJson[index].userPriviliges[0] != undefined) { // if rol == 1???
                        fila += '<tr>' + '<td>' + testJson[index].userName + '</td>';
                        if (testJson[index].userPriviliges[0].privilegeId == 1) {
                            fila += '<td> Admin </td>';
                        } else {
                            fila += '<td> Usuario </td>';
                        }
                        fila += ' <td class="intercambiar"  OnClick="Update(' + testJson[index].id + ', ' + testJson[index].userPriviliges[0].privilegeId + ')" ><img src="images/editar.png" alt="editar" /></td> ';
                        fila += ' <td class="borrar" OnClick="Delete(' + testJson[index].id + ')"><img src="images/borrar.png" alt="borrar" /> </td> </tr>';
                    }

                }
                fila += '</table>'
                document.getElementById('container').innerHTML = fila;
                document.getElementById('container').style.backgroundColor = '#28d';
                document.getElementById('container').style.border = 'solid 10px';
            }

        )


}


function getallartic() {
    var urlgetAll = 'https://localhost:44344/api/UsersLogins/GetAllArticulos';
    var tokensaved = localStorage.getItem("token");

    fetch(urlgetAll, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokensaved
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data from GetAllArticulos:', data); // Debugging line
            document.getElementById('result').innerHTML = '';

            if (Array.isArray(data) && data.length > 0) {
                let tableContent = '<table class="table"><tr><th>ID</th><th>Articulo</th><th>Description</th><th>Editar</th><th>Borrar</th></tr>';
                data.forEach(item => {
                    tableContent += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td class="intercambiar" OnClick="Update(${item.ID})">
                            <img src="images/editar.png" alt="editar" />
                        </td>
                        <td class="borrar" OnClick="Delete(${item.ID})">
                            <img src="images/borrar.png" alt="borrar" />
                        </td>
                    </tr>
                `;
                });
                tableContent += '</table>';
                document.getElementById('container').innerHTML = tableContent;
                document.getElementById('container').style.backgroundColor = '#28d';
                document.getElementById('container').style.border = 'solid 10px';
            } else {
                document.getElementById('container').innerHTML = '<p>No articles found</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createartic() { // Aca se utiliza el getelement o se lo pasa como parametro?
    var urlCreate = 'https://localhost:44344/api/UsersLogins/createArticulo'
    var Name = document.getElementById('name').value
    var description = document.getElementById('description').value
    var tokensaved = localStorage.getItem("token")



    let formData = new FormData();
    formData.append('name', Name);
    formData.append('description', description);

    fetch(urlCreate, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + tokensaved
            },
            body: formData
        }).then(Response => Response.json())
        .then(
            data => {
                document.getElementById('result').innerHTML = 'Articulo creado';
            }
        )
        .catch((error) => {
            document.getElementById('result').innerText = 'Usuario sin permisos';
        });
}

function createartic2() {
    var urlCreate = 'https://localhost:44344/api/UsersLogins/CreateArticulo';
    var userName = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var tokensaved = localStorage.getItem("token");

    console.log("User Name: ", userName); // Para verificar que los valores están siendo obtenidos
    console.log("Description: ", description); // Para verificar que los valores están siendo obtenidos

    let articleData = {
        name: userName,
        description: description
    };

    console.log("Article Data: ", articleData); // Para verificar que los datos están siendo formateados correctamente

    fetch(urlCreate, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokensaved
            },
            body: JSON.stringify(articleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Articulo creado:', data);
            document.getElementById('result').innerHTML = 'Articulo creado';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = 'Error al crear el articulo';
        });
}