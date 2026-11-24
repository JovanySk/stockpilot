using System.ComponentModel.DataAnnotations;

namespace InventorySystem_ASPNETCore.Models;

public class MovimientoInventario
{
    public int Id { get; set; }

    [Required]
    public int ProductoId { get; set; }
    public Producto Producto { get; set; } = null!;

    [Required]
    public TipoMovimientoInventario TipoMovimiento { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor que 0.")]
    public int Cantidad { get; set; }

    [StringLength(250)]
    public string? Motivo { get; set; }

    public DateTime FechaMovimiento { get; set; } = DateTime.UtcNow;

    [StringLength(100)]
    public string? UsuarioRegistro { get; set; }

    [StringLength(500)]
    public string? Observaciones { get; set; }
}
