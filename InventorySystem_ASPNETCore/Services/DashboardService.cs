using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.Data;
using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.Models;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem_ASPNETCore.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> ObtenerTotalProductosActivosAsync()
    {
        return await _context.Productos.CountAsync(p => p.Activo);
    }

    public async Task<int> ObtenerTotalCategoriasActivasAsync()
    {
        return await _context.Categorias.CountAsync(c => c.Activo);
    }

    public async Task<int> ObtenerTotalProveedoresActivosAsync()
    {
        return await _context.Proveedores.CountAsync(p => p.Activo);
    }

    public async Task<int> ObtenerTotalProductosStockBajoAsync()
    {
        var productos = await ObtenerProductosStockBajoAsync();
        return productos.Count;
    }

    public async Task<List<MovimientoInventarioViewModel>> ObtenerUltimosMovimientosAsync(int cantidad = 10)
    {
        return await _context.MovimientosInventario
            .OrderByDescending(m => m.FechaMovimiento)
            .Take(cantidad)
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
    }

    public async Task<List<ProductoStockViewModel>> ObtenerProductosStockBajoAsync()
    {
        var stocks = await _context.Productos
            .Where(p => p.Activo)
            .Select(p => new ProductoStockViewModel
            {
                ProductoId = p.Id,
                Nombre = p.Nombre,
                CodigoSKU = p.CodigoSKU,
                StockMinimo = p.StockMinimo,
                StockActual = p.MovimientosInventario.Sum(m =>
                    m.TipoMovimiento == TipoMovimientoInventario.Entrada ? m.Cantidad : -m.Cantidad)
            })
            .ToListAsync();

        return stocks
            .Where(s => s.StockBajo)
            .OrderBy(s => s.StockActual)
            .ToList();
    }

    public async Task<ServiceResult<DashboardInventarioViewModel>> ObtenerResumenAsync()
    {
        var inventario = await _context.Productos
            .Where(p => p.Activo)
            .Select(p => new
            {
                Stock = p.MovimientosInventario.Sum(m =>
                    m.TipoMovimiento == TipoMovimientoInventario.Entrada ? m.Cantidad : -m.Cantidad),
                p.Precio
            })
            .ToListAsync();

        var resumen = new DashboardInventarioViewModel
        {
            TotalProductosActivos = await ObtenerTotalProductosActivosAsync(),
            TotalCategoriasActivas = await ObtenerTotalCategoriasActivasAsync(),
            TotalProveedoresActivos = await ObtenerTotalProveedoresActivosAsync(),
            TotalUnidadesEnInventario = inventario.Sum(i => i.Stock),
            ValorTotalInventario = inventario.Sum(i => i.Stock * i.Precio),
            UltimosMovimientos = await ObtenerUltimosMovimientosAsync(),
            ProductosStockBajo = await ObtenerProductosStockBajoAsync()
        };

        resumen.TotalProductosStockBajo = resumen.ProductosStockBajo.Count;

        return ServiceResult<DashboardInventarioViewModel>.Ok(resumen);
    }
}
