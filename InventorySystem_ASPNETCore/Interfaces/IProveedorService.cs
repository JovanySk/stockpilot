using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.ViewModels;

namespace InventorySystem_ASPNETCore.Interfaces;

public interface IProveedorService
{
    Task<ServiceResult<List<ProveedorViewModel>>> ObtenerActivosAsync();
    Task<ServiceResult<ProveedorViewModel>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<int>> CrearAsync(ProveedorViewModel model);
    Task<ServiceResult> ActualizarAsync(ProveedorViewModel model);
    Task<ServiceResult> DesactivarAsync(int id);
}
