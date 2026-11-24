namespace InventorySystem_ASPNETCore.ViewModels;

public class ProductoListViewModel
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string CodigoSKU { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public int StockMinimo { get; set; }
    public int StockActual { get; set; }
    public string CategoriaNombre { get; set; } = string.Empty;
    public string? ProveedorNombre { get; set; }
    public bool Activo { get; set; }

    public bool StockBajo => StockActual <= StockMinimo;
}
