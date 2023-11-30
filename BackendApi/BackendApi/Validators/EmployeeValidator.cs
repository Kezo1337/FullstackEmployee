using BackendApi.Models;
using FluentValidation;

namespace BackendApi.Validators
{
    public class EmployeeValidator: AbstractValidator<Employee>
    {
        public EmployeeValidator() 
        {
            RuleFor(employee => employee.UserName).NotEmpty().WithMessage("Uporabniško ime ne sme biti prazno.");
            RuleFor(employee => employee.Email).EmailAddress().WithMessage("Vnesite veljaven e-poštni naslov.");
            RuleFor(employee => employee.Phone).NotEmpty().WithMessage("Telefonska številka mora biti večja od 0.");
            RuleFor(employee => employee.Salary).GreaterThan(0).WithMessage("Plača mora biti večja od 0.");
            RuleFor(employee => employee.Department).NotEmpty().WithMessage("Oddelek ne sme biti prazen.");
        }
    }
}
