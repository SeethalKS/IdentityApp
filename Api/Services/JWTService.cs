﻿using Api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Services
{
    public class JWTService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _jwtKey;

        public JWTService(IConfiguration config)
        {
            _config = config;
            // jwtkey used for both encrypting & decrypting the jwt token  
            _jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
        }
        public string CreateJWT(User user)
        {
            var userClaims = new List<Claim>
            {
 new Claim(ClaimTypes.NameIdentifier,user.Id),
 new Claim(ClaimTypes.Email,user.Email),
 new Claim(ClaimTypes.GivenName,user.FirstName),
 new Claim(ClaimTypes.Surname,user.LastName)
 //,new Claim("my own claim name","this is the value")
            };
            var creadentials = new SigningCredentials(_jwtKey,SecurityAlgorithms.HmacSha256Signature);
            var tokenDescripter = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(userClaims),
                Expires = DateTime.UtcNow.AddDays(int.Parse(_config["JWT:ExpiresInDays"])),
                SigningCredentials = creadentials,
                Issuer = _config["JWT:Issuer"] //from appsettings.Development.json
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwt = tokenHandler.CreateToken(tokenDescripter);
            return tokenHandler.WriteToken(jwt);

        }
    }
}
