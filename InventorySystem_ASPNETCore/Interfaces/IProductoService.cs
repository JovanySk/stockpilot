using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.ViewModels;

namespace InventorySystem_ASPNETCore.Interfaces;

public interface IProductoService
{
    Task<ServiceResult<List<ProductoListViewModel>>> ObtenerActivosAsync();
    Task<ServiceResult<ProductoListViewModel>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<ProductoEditViewModel>> ObtenerParaEditarAsync(int id);
    Task<ServiceResult<List<ProductoListViewModel>>> BuscarAsync(string? texto);
    Task<ServiceResult<List<ProductoListViewModel>>> FiltrarAsync(ProductoFiltroViewModel filtro);
    Task<ServiceResult<int>> CrearAsync(ProductoCreateViewModel model);
    Task<ServiceResult> ActualizarAsync(ProductoEditViewModel model);
    Task<ServiceResult> DesactivarAsync(int id);
    Task<bool> ExisteCodigoSKUAsync(string codigoSKU, int? excluirProductoId = null);
    Task<ServiceResult<ProductoStockViewModel>> ObtenerStockAsync(int productoId);
    Task<ServiceResult<List<ProductoStockViewModel>>> ObtenerProductosStockBajoAsync();
}
