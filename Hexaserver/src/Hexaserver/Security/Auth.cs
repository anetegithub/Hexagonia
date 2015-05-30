using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Hexaserver.Extensions;
using Hexaserver.Data;
using Microsoft.AspNet.Http;
using Hexaserver.Models;
using Microsoft.Framework.Logging;

namespace Hexaserver.Security
{
    public static class Auth
    {
        private static readonly ILogger Logger = Startup.LoggerFactory.CreateLogger<AuthResult>();

        public static AuthResult Identify(HttpContext Context)
        {
            IHeaderDictionary Headers = Context.Request.Headers;

            AuthResult Result = new AuthResult() { Role = Role.Passer };
            string[] Values = new string[0];

            if (Headers.TryGetValue("HexaSecurityToken", out Values))
            {
                Result.Platform = IdentifyPlatform(Values[0]);
                if (Result.Platform != Platform.None)
                {
                    if (Headers.TryGetValue("HexaOnlineToken", out Values))
                    {
                        string Login = String.Empty,
                                Password = String.Empty,
                                Token = Values[0];

                        if (Headers.TryGetValue("HexaLogin", out Values))
                            Login = Values[0];
                        if (Headers.TryGetValue("HexaPassword", out Values))
                            Password = Values[0];

                        if (Login != string.Empty && Password != string.Empty)
                        {
                            if (ValidateOnlineToken(Token, out Result.Player))
                            {
                                Result.Role = Role.User;
                                Result.Access = true;
                            }
                            else
                            {
                                int Id = AuthByLoginPassword(Login, Password);
                                if (Id > 0)
                                {
                                    Result.Short = CreateOnlineToken(Id);
                                    Result.Role = Role.During;
                                }
                                else
                                    Result.Role = Role.Familiar;
                            }
                        }
                        else
                            Result.Role = Role.Guest;
                    }
                }
            }

            return Result;
        }

        private static Platform IdentifyPlatform(String Token)
        {
            if (Token == WpToken)
                return Platform.Wp;
            if (Token == AndToken)
                return Platform.And;
            if (Token == IosToken)
                return Platform.Ios;
            return Platform.None;
        }
        private static String WpToken = "39Tbh40AG4w587hzW0CuYh5g3VjyhJSdDeb7c9HiSrmG3JyPo4Tq0Lo9yJCFFJc3THP4L96GCXgpS605427NhC1Jzij7ww1m",
            AndToken = "0MV71O3Nph7W08VH95OiT4l3cZ059hQMa87zM880mP9Q3k8W3P8Hncz6PlMk264QH21L497v75R6D24G6OV5tyK2pRntC5ND",
            IosToken = "Kxeu3052PT07F723ZqhYG38BZ2668q1473oAcQbP08rU0URgeO0ZbFd0r4ezs8Y7cfLy1k6CIm162sdicQRF8MCXVG48AToj";

        private static Boolean ValidateOnlineToken(String Token, out int Id)
        {
            Id = 0;

            if (String.IsNullOrEmpty(Token))
                return false;

            Int32 DatePart = 0;

            if (Token.Length < 9)
                return false;

            if (!int.TryParse(Token.Substring(0, 8), out DatePart))
                return false;

            if (Token.IndexOf(DatePart.ToString("X"))!=-1)
            {
                int.TryParse(Token.Replace(DatePart.ToString() + DatePart.ToString("X"), ""), out Id);
                return true;
            }

            return true;
        }
        private static String CreateOnlineToken(int Id)
        {
            return DateTime.Now.Date.ToString("ddMMyyyy") + int.Parse(DateTime.Now.Date.ToString("ddMMyyyy")).ToString("X") + Id.ToString();
        }
        private static int AuthByLoginPassword(string Login, string Password)
        {
            //verify login&password

            Player Player = FindPlayer(Login, Password);

            return Player == null ? 0 : Player.PlayerId;
        }
        private static Player FindPlayer(string Login, string Password)
        {
#if !DEBUG
            using (var db = new AccountContext())
                return db.Players.Where(x => x.Login == Login && x.Password == Password).FirstOrDefault();
#endif
#if DEBUG
            return new Repository.FakeRepository().AllItems.Where(x => x.Login == Login && x.Password == Password).FirstOrDefault();
#endif
        }
    }

    public class AuthResult
    {
        public string Short;
        public bool Access;
        public Platform Platform;
        public Role Role;
        public int Player;
    }

    public enum Platform
    {
        Wp = 0,
        And,
        Ios,
        None
    }

    public enum Role
    {
        /// <summary>
        /// Authorized user
        /// </summary>
        User = 0,
        /// <summary>
        /// Trusted application, have short, have login and password, but wrong
        /// </summary>
        Familiar,
        /// <summary>
        /// Trusted application, have short but haven't login and/or password
        /// </summary>
        Guest,
        /// <summary>
        /// Trusted application, but haven't Short
        /// </summary>
        During,
        /// <summary>
        /// Not trusted application
        /// </summary>
        Passer
    }
}