using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TpLogin.Models;
using TpLogin.DTOs;
using AutoMapper.QueryableExtensions;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;

namespace TpLogin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersLoginsController : ControllerBase
    {
        private readonly LoginDBContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;


        public UsersLoginsController(LoginDBContext context, IMapper mapper, IConfiguration config)
        {
            _context = context;
            _mapper = mapper;
            _config = config;
        }


        [HttpGet]
        public IActionResult Login(string userName, string password)
        {
             UsersLogin login = new UsersLogin();

            login.UserName = userName;
            login.PasswordHash = password;

            IActionResult response = Unauthorized();

            var user = AuthenticateUser(login);

            if (user != null)
            {
                var tokenStr = GenerateJSONWebToken(user);

                response = Ok(new { token = tokenStr, userName = userName });
            }

            return response;
        }

        private string GenerateJSONWebToken(UsersLogin userinfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            UserPrivilige userPrivilige = _context.UserPriviliges.FirstOrDefault(pr => pr.UsersLoginId == userinfo.Id);
            Privilege rol = _context.Privileges.FirstOrDefault(r => r.Id == userPrivilige.PrivilegeId);


            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userinfo.UserName),
                new Claim(JwtRegisteredClaimNames.Email, userinfo.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, rol.Description),
            };


            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: credentials
                );

            var encodeToken = new JwtSecurityTokenHandler().WriteToken(token);

            return encodeToken;
        }

        private UsersLogin AuthenticateUser(UsersLogin login)
        {
            var usersLogin = _context.UsersLogins.FirstOrDefault(us => us.UserName == login.UserName);


            if (usersLogin != null)
            {
                string passwordHasheado = getHashPasswordWithSalt(login.PasswordHash, usersLogin.Salt);

                if (passwordHasheado == usersLogin.PasswordHash)
                {
                    return usersLogin;
                }
            }


            return null;
        }

        private string getHashPasswordWithSalt(string passwordHash, string salt)
        {
            var sha1 = new SHA1CryptoServiceProvider();
            var byteHash = sha1.ComputeHash(Encoding.UTF8.GetBytes(passwordHash + salt));

            return Convert.ToBase64String(byteHash);
        }

        [Authorize(Roles = "User")]
        [HttpPost("Post")]

        public string Post()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IList<Claim> claim = identity.Claims.ToList();
            var userName = claim[0].Value;
            return "Ejemplo de solo usuario username: " + userName;

        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<UsersLoginDTO>>> GetAll()
        {
            return await _context.UsersLogins.ProjectTo<UsersLoginDTO>(_mapper.ConfigurationProvider).Where(pr => pr.PasswordHash != "")
           .ToListAsync(); ;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createUser")]
        public IActionResult CreateUser()
        {
            var rol = Request.Form["rol"];
            var pass = Request.Form["password"];
            var userName = Request.Form["userName"];
            Random r = new Random();
            string salt = (r.Next(0, 100)).ToString();

           
            UsersLogin user = new UsersLogin();

            user.Salt = salt;
            user.UserName = userName;
            user.PasswordHash = getHashPasswordWithSalt(pass, salt);

            
            

            var newUser = _context.UsersLogins.Add(user);
            _context.SaveChanges();

            UserPrivilige userPrivilige = new UserPrivilige();
            userPrivilige.UsersLoginId = newUser.Entity.Id;
            userPrivilige.PrivilegeId = Int32.Parse(rol);

            _context.UserPriviliges.Add(userPrivilige);
            _context.SaveChanges();


            return Ok(new { message = "Usuario creado" });

        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteUser/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.UsersLogins.Find(id);

            //borro el passwrd para que no pueda ingresar, pero dejar el usuario para el historial.
            user.PasswordHash = "";
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();


            return Ok(new {message = "Usuario borrado" });

        }

        //1 = Admin
        //2 = User
        [Authorize(Roles = "Admin")]
        [HttpPut("editUser/{id}")]
        public IActionResult EditUser(int id)
        {
            var rol =  Request.Form["rol"];

            UserPrivilige userPrivilige = _context.UserPriviliges.FirstOrDefault(pr => pr.UsersLoginId == id);
            userPrivilige.PrivilegeId = Int32.Parse(rol);

            _context.Entry(userPrivilige).State = EntityState.Modified;
            _context.SaveChanges();


            return Ok(new { message = "Usuario editado" });

        }
        //[HttpPost("createFirstUser")]
        //public IActionResult CreateFirstUser()
        //{
        //    var userName = "admincito";
        //    var pass = "AdminPassword"; // Cambia esto por una contraseña segura
        //    var rol = 1; // Supongamos que 1 es el ID del rol de Admin

        //    Random r = new Random();
        //    string salt = (r.Next(0, 100)).ToString();

        //    UsersLogin user = new UsersLogin
        //    {
        //        Salt = salt,
        //        UserName = userName,
        //        PasswordHash = getHashPasswordWithSalt(pass, salt)
        //    };

        //    var newUser = _context.UsersLogins.Add(user);
        //    _context.SaveChanges();

        //    UserPrivilige userPrivilige = new UserPrivilige
        //    {
        //        UsersLoginId = newUser.Entity.Id,
        //        PrivilegeId = rol
        //    };

        //    _context.UserPriviliges.Add(userPrivilige);
        //    _context.SaveChanges();

        //    return Ok(new { message = "Primer usuario creado" });
        //}

        /*
        // GET: api/UsersLogins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsersLoginDTO>>> GetUsersLogins()
        {
            //var entities = _context.UsersLogins.ToList();
            //return _mapper.Map<UsersLoginDTO[]>(entities);


            

            return await _context.UsersLogins.ProjectTo<UsersLoginDTO>(_mapper.ConfigurationProvider)
           .ToListAsync();

            //return await _context.UsersLogins.ToListAsync();
        }

        
        // GET: api/UsersLogins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsersLogin>> GetUsersLogin(int id)
        {
            var usersLogin = await _context.UsersLogins.FindAsync(id);

            if (usersLogin == null)
            {
                return NotFound();
            }

            return usersLogin;
        }

        // PUT: api/UsersLogins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsersLogin(int id, UsersLogin usersLogin)
        {
            if (id != usersLogin.Id)
            {
                return BadRequest();
            }

            _context.Entry(usersLogin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersLoginExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UsersLogins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        
        [HttpPost]
        public async Task<ActionResult<UsersLogin>> PostUsersLogin(UsersLogin usersLogin)
        {
            _context.UsersLogins.Add(usersLogin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsersLogin", new { id = usersLogin.Id }, usersLogin);
        }
        
        // DELETE: api/UsersLogins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsersLogin(int id)
        {
            var usersLogin = await _context.UsersLogins.FindAsync(id);
            if (usersLogin == null)
            {
                return NotFound();
            }

            _context.UsersLogins.Remove(usersLogin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsersLoginExists(int id)
        {
            return _context.UsersLogins.Any(e => e.Id == id);
        }
        */
    }
}
