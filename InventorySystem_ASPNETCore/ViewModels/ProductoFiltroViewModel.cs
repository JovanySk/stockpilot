namespace InventorySystem_ASPNETCore.ViewModels;

public class ProductoFiltroViewModel
{
    public string? Texto { get; set; }
    public int? CategoriaId { get; set; }
    public int? ProveedorId { get; set; }
    public bool SoloStockBajo { get; set; }
}
