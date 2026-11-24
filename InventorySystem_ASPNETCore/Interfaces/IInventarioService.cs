using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.ViewModels;

namespace InventorySystem_ASPNETCore.Interfaces;

public interface IInventarioService
{
    Task<ServiceResult<MovimientoInventarioViewModel>> RegistrarEntradaAsync(MovimientoInventarioViewModel model);
    Task<ServiceResult<MovimientoInventarioViewModel>> RegistrarSalidaAsync(MovimientoInventarioViewModel model);
    Task<ServiceResult<List<MovimientoInventarioViewModel>>> ObtenerHistorialProductoAsync(int productoId);
    Task<ServiceResult<int>> ObtenerStockActualAsync(int productoId);
}
