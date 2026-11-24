namespace InventorySystem_ASPNETCore.ViewModels;

public class ProductoStockViewModel
{
    public int ProductoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string CodigoSKU { get; set; } = string.Empty;
    public int StockActual { get; set; }
    public int StockMinimo { get; set; }

    public bool StockBajo => StockActual <= StockMinimo;
}
