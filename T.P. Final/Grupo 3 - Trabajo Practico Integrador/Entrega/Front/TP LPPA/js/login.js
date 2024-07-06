const URL = "https://localhost:44344/api/UsersLogins?userName=fclarat&password=test"
// Faltarian agregar mas URL de los endpoints para cada metodo
const myHeaders = new Headers();


//Login del usuario
function login(){ 
    // Llamas a la API con un user y PW y la API te devuelve un token
    var username = document.getElementById('nombre').value
    var password = document.getElementById('password').value
    var urlLogin =  'https://localhost:44344/api/UsersLogins?userName=' + username + '&password=' + password
    fetch(urlLogin, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(data.token != undefined) {
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
function create(){ // Aca se utiliza el getelement o se lo pasa como parametro?
    var urlCreate =  'https://localhost:44344/api/UsersLogins/createUser'
    var rol = document.getElementById('rol-names').value
    var userName = document.getElementById('nombre').value
    var password = document.getElementById('password').value
    var tokensaved = localStorage.getItem("token")

    if (rol == 'admin')
    {
        rol=1;
    }
    else{
        rol = 2;
    }


    let formData = new FormData();
    formData.append('rol', rol);
    formData.append('userName', userName);
    formData.append('password', password);

    fetch(urlCreate,{
        method : "POST",
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
function Update(id, rol){
    var urlUpdate =  'https://localhost:44344/api/UsersLogins/editUser/' + id
    var tokensaved = localStorage.getItem("token")

    if(rol == 1 ){
        rol = 2
    } else
    {
        rol = 1 
    }

    let formData = new FormData();
    formData.append('rol', rol);

    fetch(urlUpdate,{
        method : "PUT",
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
function Delete(id){
    var urlDelete =  'https://localhost:44344/api/UsersLogins/deleteUser/' + id
    var tokensaved = localStorage.getItem("token")

    fetch(urlDelete,{
        method : "DELETE",
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
function getall(){
    var urlgetAll =  'https://localhost:44344/api/UsersLogins/GetAllUsers'
    var tokensaved = localStorage.getItem("token")

    fetch(urlgetAll,  {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tokensaved
         }
     })
    .then(Response => Response.json())
    .then(
        data => {

            document.getElementById('result').innerHTML = '';

            var testInfo = `[
                {
                    "id": 1,
                    "userName": "fclarat",
                    "userPriviliges": [
                        {
                            "id": 3,
                            "usersLoginId": 1,
                            "privilegeId": 1,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 5,
                    "userName": "fclarat2",
                    "userPriviliges": [
                        {
                            "id": 4,
                            "usersLoginId": 5,
                            "privilegeId": 1,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 6,
                    "userName": "fclarat3",
                    "userPriviliges": []
                },
                {
                    "id": 7,
                    "userName": "fclarat4",
                    "userPriviliges": []
                },
                {
                    "id": 9,
                    "userName": "fclarat5",
                    "userPriviliges": [
                        {
                            "id": 5,
                            "usersLoginId": 9,
                            "privilegeId": 1,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 10,
                    "userName": "fclarat6",
                    "userPriviliges": [
                        {
                            "id": 6,
                            "usersLoginId": 10,
                            "privilegeId": 1,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 11,
                    "userName": "fclarat7",
                    "userPriviliges": [
                        {
                            "id": 7,
                            "usersLoginId": 11,
                            "privilegeId": 1,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 12,
                    "userName": "fclarat8",
                    "userPriviliges": [
                        {
                            "id": 8,
                            "usersLoginId": 12,
                            "privilegeId": 2,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 13,
                    "userName": "fclarat10",
                    "userPriviliges": [
                        {
                            "id": 9,
                            "usersLoginId": 13,
                            "privilegeId": 2,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                },
                {
                    "id": 14,
                    "userName": "fclarat11",
                    "userPriviliges": [
                        {
                            "id": 10,
                            "usersLoginId": 14,
                            "privilegeId": 1,
                            "privilege": null,
                            "usersLogin": null
                        }
                    ]
                }
            ]`
            testJson = data;
            var fila = '<table class="table"><tr><th>Usuario</th><th>Rol</th><th>intercambiar rol</th><th>Borrar</th>';
            for (let index = 0; index < testJson.length; index++) {

               if(testJson[index].userPriviliges[0]  != undefined ){ // if rol == 1???
                    fila += '<tr>' + '<td>' + testJson[index].userName + '</td>';
                    if(testJson[index].userPriviliges[0].privilegeId == 1){
                        fila += '<td> Admin </td>';
                    } else {
                        fila += '<td> Usuario </td>';
                    }
                    fila +=' <td class="intercambiar"  OnClick="Update(' + testJson[index].id + ', '+testJson[index].userPriviliges[0].privilegeId+')" ><img src="images/editar.png" alt="editar" /></td> ';
                    fila +=' <td class="borrar" OnClick="Delete(' + testJson[index].id + ')"><img src="images/borrar.png" alt="borrar" /> </td> </tr>';
               }

            }
            fila += '</table>'
            document.getElementById('container').innerHTML = fila; 
            document.getElementById('container').style.backgroundColor =  '#28d';
            document.getElementById('container').style.border= 'solid 10px';
        }

    )

}

