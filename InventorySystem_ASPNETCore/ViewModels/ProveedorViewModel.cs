using System.ComponentModel.DataAnnotations;

namespace InventorySystem_ASPNETCore.ViewModels;

public class ProveedorViewModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El nombre del proveedor es obligatorio.")]
    [StringLength(150)]
    [Display(Name = "Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(150)]
    [Display(Name = "Contacto")]
    public string? Contacto { get; set; }

    [StringLength(20)]
    [Phone(ErrorMessage = "El teléfono no tiene un formato válido.")]
    [Display(Name = "Teléfono")]
    public string? Telefono { get; set; }

    [StringLength(150)]
    [EmailAddress(ErrorMessage = "El correo no tiene un formato válido.")]
    [Display(Name = "Correo electrónico")]
    public string? Email { get; set; }

    [StringLength(250)]
    [Display(Name = "Dirección")]
    public string? Direccion { get; set; }

    [Display(Name = "Activo")]
    public bool Activo { get; set; } = true;

    [Display(Name = "Fecha de creación")]
    public DateTime FechaCreacion { get; set; }

    [Display(Name = "Productos activos")]
    public int TotalProductosActivos { get; set; }
}
