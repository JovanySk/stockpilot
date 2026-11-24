using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.ViewModels;

namespace InventorySystem_ASPNETCore.Interfaces;

public interface ICategoriaService
{
    Task<ServiceResult<List<CategoriaViewModel>>> ObtenerActivasAsync();
    Task<ServiceResult<CategoriaViewModel>> ObtenerPorIdAsync(int id);
    Task<ServiceResult<int>> CrearAsync(CategoriaViewModel model);
    Task<ServiceResult> ActualizarAsync(CategoriaViewModel model);
    Task<ServiceResult> DesactivarAsync(int id);
}
