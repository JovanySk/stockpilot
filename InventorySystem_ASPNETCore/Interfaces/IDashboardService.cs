using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.ViewModels;

namespace InventorySystem_ASPNETCore.Interfaces;

public interface IDashboardService
{
    Task<int> ObtenerTotalProductosActivosAsync();
    Task<int> ObtenerTotalCategoriasActivasAsync();
    Task<int> ObtenerTotalProveedoresActivosAsync();
    Task<int> ObtenerTotalProductosStockBajoAsync();
    Task<List<MovimientoInventarioViewModel>> ObtenerUltimosMovimientosAsync(int cantidad = 10);
    Task<List<ProductoStockViewModel>> ObtenerProductosStockBajoAsync();
    Task<ServiceResult<DashboardInventarioViewModel>> ObtenerResumenAsync();
}
