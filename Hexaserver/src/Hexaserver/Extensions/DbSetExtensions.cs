using Microsoft.Data.Entity.Relational;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Extensions
{
    public static class DbSetExtensions
    {
        public static int ExecuteSqlCommand(this RelationalDatabase database, string sql)
        {
            var connection = database.Connection;
            var command = connection.DbConnection.CreateCommand();
            command.CommandText = sql;

            try
            {
                connection.Open();

                return command.ExecuteNonQuery();
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
