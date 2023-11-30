using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class Employee
    {
        public int id {  get; set; }
        public string UserName { get; set; }
        public DateTime DateOfApplication { get; set; }
            = DateTime.Now;
        public string Email { get; set; }
        public int Phone { get; set; }
        public int Salary { get; set; }
        public string Department { get; set; }
    }
}
