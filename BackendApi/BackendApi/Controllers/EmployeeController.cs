using BackendApi.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;
using BackendApi.Validators;

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _config;

        public EmployeeController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<List<Employee>>> GetAllEmployees()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var employees = await connection.QueryAsync<Employee>("select * from Employees");
            return Ok(employees);
        }

        [HttpGet("{employeeId}")]
        public async Task<ActionResult<List<Employee>>> GetEmployeeById(int employeeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var employee = await connection.QueryFirstAsync<Employee>("select * from Employees where id = @Id",
               new { Id = employeeId });
            return Ok(employee);
        }

        [HttpPost]
        public async Task<ActionResult<List<Employee>>> CreateEmployee(Employee employee)
        {

            var validator = new EmployeeValidator();
            var validationResult = validator.Validate(employee);

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("insert into Employees (UserName, DateOfApplication, Email, Phone, Salary, Department) values (@UserName, @DateOfApplication, @Email, @Phone, @Salary, @Department)", employee);
            return Ok(await SelectAllEmployees(connection));
        }

        private async Task<IEnumerable<Employee>> SelectAllEmployees(SqlConnection connection)
        {
            return await connection.QueryAsync<Employee>("select * from Employees");
        }

        [HttpPut("{employeeId}")]
        public async Task<ActionResult<List<Employee>>> UpdateEmployee(int employeeId, Employee employee)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var existingEmployee = await connection.QueryFirstOrDefaultAsync<Employee>("SELECT * FROM Employees WHERE id = @Id", new { Id = employeeId });
            await connection.ExecuteAsync("UPDATE Employees SET UserName = @UserName, " +
                "DateOfApplication = @DateOfApplication, " +
                "Email = @Email, " +
                "Phone = @Phone, " +
                "Salary = @Salary, " +
                "Department = @Department " +
                "WHERE id = @Id", new { Id = employeeId, employee.UserName, employee.DateOfApplication, employee.Email, employee.Phone, employee.Salary, employee.Department });
            return Ok(await SelectAllEmployees(connection));
        }

        [HttpDelete("{employeeId}")]
        public async Task<ActionResult<List<Employee>>> DeleteEmployee(int employeeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync("delete from Employees where id = @Id ", new {Id = employeeId});
            return Ok(await SelectAllEmployees(connection));
        }
    }
}
