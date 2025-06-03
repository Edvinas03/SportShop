public interface ICreateProductService
{
    Task<short> Create(CreateProductDto dto);
}