using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface IGetStudentService
    {
        Task<List<StudentDto>> GetAll();
        Task<StudentDto> Get(int id);
    }
}
