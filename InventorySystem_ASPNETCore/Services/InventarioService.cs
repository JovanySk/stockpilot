using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.Data;
using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.Models;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem_ASPNETCore.Services;

public class InventarioService : IInventarioService
{
    private readonly ApplicationDbContext _context;

    public InventarioService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<MovimientoInventarioViewModel>> RegistrarEntradaAsync(MovimientoInventarioViewModel model)
    {
        return await RegistrarMovimientoAsync(model, TipoMovimientoInventario.Entrada);
    }

    public async Task<ServiceResult<MovimientoInventarioViewModel>> RegistrarSalidaAsync(MovimientoInventarioViewModel model)
    {
        return await RegistrarMovimientoAsync(model, TipoMovimientoInventario.Salida);
    }

    public async Task<ServiceResult<List<MovimientoInventarioViewModel>>> ObtenerHistorialProductoAsync(int productoId)
    {
        var productoExiste = await _context.Productos.AnyAsync(p => p.Id == productoId);
        if (!productoExiste)
        {
            return ServiceResult<List<MovimientoInventarioViewModel>>.Fail("El producto no existe.");
        }

        var movimientos = await _context.MovimientosInventario
            .Where(m => m.ProductoId == productoId)
            .OrderByDescending(m => m.FechaMovimiento)
            .Select(m => new MovimientoInventarioViewModel
            {
                Id = m.Id,
                ProductoId = m.ProductoId,
                ProductoNombre = m.Producto.Nombre,
                CodigoSKU = m.Producto.CodigoSKU,
                TipoMovimiento = m.TipoMovimiento,
                Cantidad = m.Cantidad,
                Motivo = m.Motivo ?? string.Empty,
                FechaMovimiento = m.FechaMovimiento,
                UsuarioRegistro = m.UsuarioRegistro,
                Observaciones = m.Observaciones
            })
            .ToListAsync();

        return ServiceResult<List<MovimientoInventarioViewModel>>.Ok(movimientos);
    }

    public async Task<ServiceResult<int>> ObtenerStockActualAsync(int productoId)
    {
        var productoExiste = await _context.Productos.AnyAsync(p => p.Id == productoId);
        if (!productoExiste)
        {
            return ServiceResult<int>.Fail("El producto no existe.");
        }

        var stock = await CalcularStockAsync(productoId);

        return ServiceResult<int>.Ok(stock);
    }

    private async Task<ServiceResult<MovimientoInventarioViewModel>> RegistrarMovimientoAsync(
        MovimientoInventarioViewModel model,
        TipoMovimientoInventario tipo)
    {
        if (model.Cantidad <= 0)
        {
            return ServiceResult<MovimientoInventarioViewModel>.Fail("La cantidad debe ser mayor que 0.");
        }

        if (string.IsNullOrWhiteSpace(model.Motivo))
        {
            return ServiceResult<MovimientoInventarioViewModel>.Fail("El motivo del movimiento es obligatorio.");
        }

        var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == model.ProductoId);

        if (producto is null)
        {
            return ServiceResult<MovimientoInventarioViewModel>.Fail("El producto no existe.");
        }

        if (!producto.Activo)
        {
            return ServiceResult<MovimientoInventarioViewModel>.Fail(
                "No se pueden registrar movimientos sobre un producto inactivo.");
        }

        if (tipo == TipoMovimientoInventario.Salida)
        {
            var stockActual = await CalcularStockAsync(producto.Id);
            if (model.Cantidad > stockActual)
            {
                return ServiceResult<MovimientoInventarioViewModel>.Fail(
                    $"La salida de {model.Cantidad} unidad(es) excede el stock disponible ({stockActual}).");
            }
        }

        var movimiento = new MovimientoInventario
        {
            ProductoId = producto.Id,
            TipoMovimiento = tipo,
            Cantidad = model.Cantidad,
            Motivo = model.Motivo.Trim(),
            FechaMovimiento = DateTime.UtcNow,
            UsuarioRegistro = model.UsuarioRegistro?.Trim(),
            Observaciones = model.Observaciones?.Trim()
        };

        _context.MovimientosInventario.Add(movimiento);
        await _context.SaveChangesAsync();

        var resultado = new MovimientoInventarioViewModel
        {
            Id = movimiento.Id,
            ProductoId = producto.Id,
            ProductoNombre = producto.Nombre,
            CodigoSKU = producto.CodigoSKU,
            TipoMovimiento = movimiento.TipoMovimiento,
            Cantidad = movimiento.Cantidad,
            Motivo = movimiento.Motivo,
            FechaMovimiento = movimiento.FechaMovimiento,
            UsuarioRegistro = movimiento.UsuarioRegistro,
            Observaciones = movimiento.Observaciones
        };

        var mensaje = tipo == TipoMovimientoInventario.Entrada
            ? "Entrada de inventario registrada correctamente."
            : "Salida de inventario registrada correctamente.";

        return ServiceResult<MovimientoInventarioViewModel>.Ok(resultado, mensaje);
    }

    private async Task<int> CalcularStockAsync(int productoId)
    {
        return await _context.MovimientosInventario
            .Where(m => m.ProductoId == productoId)
            .SumAsync(m => m.TipoMovimiento == TipoMovimientoInventario.Entrada ? m.Cantidad : -m.Cantidad);
    }
}
