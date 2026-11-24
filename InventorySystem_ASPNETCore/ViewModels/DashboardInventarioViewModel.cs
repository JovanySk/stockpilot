namespace InventorySystem_ASPNETCore.ViewModels;

public class DashboardInventarioViewModel
{
    public int TotalProductosActivos { get; set; }
    public int TotalCategoriasActivas { get; set; }
    public int TotalProveedoresActivos { get; set; }
    public int TotalProductosStockBajo { get; set; }
    public int TotalUnidadesEnInventario { get; set; }
    public decimal ValorTotalInventario { get; set; }
    public List<MovimientoInventarioViewModel> UltimosMovimientos { get; set; } = new();
    public List<ProductoStockViewModel> ProductosStockBajo { get; set; } = new();
}
