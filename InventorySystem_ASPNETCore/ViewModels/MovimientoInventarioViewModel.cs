using System.ComponentModel.DataAnnotations;
using InventorySystem_ASPNETCore.Models;

namespace InventorySystem_ASPNETCore.ViewModels;

public class MovimientoInventarioViewModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El producto es obligatorio.")]
    [Display(Name = "Producto")]
    public int ProductoId { get; set; }

    public string ProductoNombre { get; set; } = string.Empty;
    public string CodigoSKU { get; set; } = string.Empty;

    [Display(Name = "Tipo de movimiento")]
    public TipoMovimientoInventario TipoMovimiento { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor que 0.")]
    [Display(Name = "Cantidad")]
    public int Cantidad { get; set; }

    [Required(ErrorMessage = "El motivo es obligatorio.")]
    [StringLength(250)]
    [Display(Name = "Motivo")]
    public string Motivo { get; set; } = string.Empty;

    [Display(Name = "Fecha de movimiento")]
    public DateTime FechaMovimiento { get; set; }

    [StringLength(100)]
    [Display(Name = "Usuario")]
    public string? UsuarioRegistro { get; set; }

    [StringLength(500)]
    [Display(Name = "Observaciones")]
    public string? Observaciones { get; set; }
}
