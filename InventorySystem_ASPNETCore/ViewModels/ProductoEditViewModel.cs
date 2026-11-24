using System.ComponentModel.DataAnnotations;

namespace InventorySystem_ASPNETCore.ViewModels;

public class ProductoEditViewModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
    [StringLength(150)]
    [Display(Name = "Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El código SKU es obligatorio.")]
    [StringLength(50)]
    [Display(Name = "Código SKU")]
    public string CodigoSKU { get; set; } = string.Empty;

    [StringLength(500)]
    [Display(Name = "Descripción")]
    public string? Descripcion { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "El precio no puede ser negativo.")]
    [Display(Name = "Precio")]
    public decimal Precio { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "El stock mínimo no puede ser negativo.")]
    [Display(Name = "Stock mínimo")]
    public int StockMinimo { get; set; }

    [Required(ErrorMessage = "La categoría es obligatoria.")]
    [Display(Name = "Categoría")]
    public int CategoriaId { get; set; }

    [Display(Name = "Proveedor")]
    public int? ProveedorId { get; set; }

    [Display(Name = "Activo")]
    public bool Activo { get; set; } = true;
}
