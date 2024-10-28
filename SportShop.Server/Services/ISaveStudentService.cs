using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface ISaveStudentService
    {
        Task Store(StudentDto dto);
        Task Update(int id, StudentDto dto);
        Task Delete(int id);
    }
}
