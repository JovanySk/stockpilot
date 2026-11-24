using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.Data;
using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.Models;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem_ASPNETCore.Services;

public class ProductoService : IProductoService
{
    private readonly ApplicationDbContext _context;

    public ProductoService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<List<ProductoListViewModel>>> ObtenerActivosAsync()
    {
        return await FiltrarAsync(new ProductoFiltroViewModel());
    }

    public async Task<ServiceResult<ProductoListViewModel>> ObtenerPorIdAsync(int id)
    {
        var producto = await _context.Productos
            .Where(p => p.Id == id)
            .Select(ProyectarAListViewModel())
            .FirstOrDefaultAsync();

        if (producto is null)
        {
            return ServiceResult<ProductoListViewModel>.Fail("El producto no existe.");
        }

        return ServiceResult<ProductoListViewModel>.Ok(producto);
    }

    public async Task<ServiceResult<ProductoEditViewModel>> ObtenerParaEditarAsync(int id)
    {
        var producto = await _context.Productos
            .Where(p => p.Id == id)
            .Select(p => new ProductoEditViewModel
            {
                Id = p.Id,
                Nombre = p.Nombre,
                CodigoSKU = p.CodigoSKU,
                Descripcion = p.Descripcion,
                Precio = p.Precio,
                StockMinimo = p.StockMinimo,
                CategoriaId = p.CategoriaId,
                ProveedorId = p.ProveedorId,
                Activo = p.Activo
            })
            .FirstOrDefaultAsync();

        if (producto is null)
        {
            return ServiceResult<ProductoEditViewModel>.Fail("El producto no existe.");
        }

        return ServiceResult<ProductoEditViewModel>.Ok(producto);
    }

    public async Task<ServiceResult<List<ProductoListViewModel>>> BuscarAsync(string? texto)
    {
        return await FiltrarAsync(new ProductoFiltroViewModel { Texto = texto });
    }

    public async Task<ServiceResult<List<ProductoListViewModel>>> FiltrarAsync(ProductoFiltroViewModel filtro)
    {
        var query = _context.Productos.Where(p => p.Activo);

        if (!string.IsNullOrWhiteSpace(filtro.Texto))
        {
            var texto = filtro.Texto.Trim();
            query = query.Where(p =>
                p.Nombre.Contains(texto) ||
                p.CodigoSKU.Contains(texto) ||
                (p.Descripcion != null && p.Descripcion.Contains(texto)));
        }

        if (filtro.CategoriaId.HasValue)
        {
            query = query.Where(p => p.CategoriaId == filtro.CategoriaId.Value);
        }

        if (filtro.ProveedorId.HasValue)
        {
            query = query.Where(p => p.ProveedorId == filtro.ProveedorId.Value);
        }

        var productos = await query
            .OrderBy(p => p.Nombre)
            .Select(ProyectarAListViewModel())
            .ToListAsync();

        if (filtro.SoloStockBajo)
        {
            productos = productos.Where(p => p.StockBajo).ToList();
        }

        return ServiceResult<List<ProductoListViewModel>>.Ok(productos);
    }

    public async Task<ServiceResult<int>> CrearAsync(ProductoCreateViewModel model)
    {
        var codigoSKU = model.CodigoSKU.Trim();

        if (await ExisteCodigoSKUAsync(codigoSKU))
        {
            return ServiceResult<int>.Fail($"Ya existe un producto con el código SKU '{codigoSKU}'.");
        }

        var categoriaValida = await _context.Categorias
            .AnyAsync(c => c.Id == model.CategoriaId && c.Activo);
        if (!categoriaValida)
        {
            return ServiceResult<int>.Fail("La categoría seleccionada no existe o está inactiva.");
        }

        if (model.ProveedorId.HasValue)
        {
            var proveedorValido = await _context.Proveedores
                .AnyAsync(p => p.Id == model.ProveedorId.Value && p.Activo);
            if (!proveedorValido)
            {
                return ServiceResult<int>.Fail("El proveedor seleccionado no existe o está inactivo.");
            }
        }

        var producto = new Producto
        {
            Nombre = model.Nombre.Trim(),
            CodigoSKU = codigoSKU,
            Descripcion = model.Descripcion?.Trim(),
            Precio = model.Precio,
            StockMinimo = model.StockMinimo,
            CategoriaId = model.CategoriaId,
            ProveedorId = model.ProveedorId,
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();

        return ServiceResult<int>.Ok(producto.Id, "Producto creado correctamente.");
    }

    public async Task<ServiceResult> ActualizarAsync(ProductoEditViewModel model)
    {
        var producto = await _context.Productos.FindAsync(model.Id);
        if (producto is null)
        {
            return ServiceResult.Fail("El producto no existe.");
        }

        var codigoSKU = model.CodigoSKU.Trim();

        if (await ExisteCodigoSKUAsync(codigoSKU, model.Id))
        {
            return ServiceResult.Fail($"Ya existe otro producto con el código SKU '{codigoSKU}'.");
        }

        var categoriaValida = await _context.Categorias
            .AnyAsync(c => c.Id == model.CategoriaId && c.Activo);
        if (!categoriaValida)
        {
            return ServiceResult.Fail("La categoría seleccionada no existe o está inactiva.");
        }

        if (model.ProveedorId.HasValue)
        {
            var proveedorValido = await _context.Proveedores
                .AnyAsync(p => p.Id == model.ProveedorId.Value && p.Activo);
            if (!proveedorValido)
            {
                return ServiceResult.Fail("El proveedor seleccionado no existe o está inactivo.");
            }
        }

        producto.Nombre = model.Nombre.Trim();
        producto.CodigoSKU = codigoSKU;
        producto.Descripcion = model.Descripcion?.Trim();
        producto.Precio = model.Precio;
        producto.StockMinimo = model.StockMinimo;
        producto.CategoriaId = model.CategoriaId;
        producto.ProveedorId = model.ProveedorId;
        producto.Activo = model.Activo;
        producto.FechaActualizacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ServiceResult.Ok("Producto actualizado correctamente.");
    }

    public async Task<ServiceResult> DesactivarAsync(int id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto is null)
        {
            return ServiceResult.Fail("El producto no existe.");
        }

        if (!producto.Activo)
        {
            return ServiceResult.Fail("El producto ya está desactivado.");
        }

        producto.Activo = false;
        producto.FechaActualizacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ServiceResult.Ok("Producto desactivado correctamente.");
    }

    public async Task<bool> ExisteCodigoSKUAsync(string codigoSKU, int? excluirProductoId = null)
    {
        var sku = codigoSKU.Trim();
        return await _context.Productos
            .AnyAsync(p => p.CodigoSKU == sku && (excluirProductoId == null || p.Id != excluirProductoId));
    }

    public async Task<ServiceResult<ProductoStockViewModel>> ObtenerStockAsync(int productoId)
    {
        var stock = await _context.Productos
            .Where(p => p.Id == productoId)
            .Select(ProyectarAStockViewModel())
            .FirstOrDefaultAsync();

        if (stock is null)
        {
            return ServiceResult<ProductoStockViewModel>.Fail("El producto no existe.");
        }

        return ServiceResult<ProductoStockViewModel>.Ok(stock);
    }

    public async Task<ServiceResult<List<ProductoStockViewModel>>> ObtenerProductosStockBajoAsync()
    {
        var stocks = await _context.Productos
            .Where(p => p.Activo)
            .Select(ProyectarAStockViewModel())
            .ToListAsync();

        var stockBajo = stocks
            .Where(s => s.StockBajo)
            .OrderBy(s => s.StockActual)
            .ToList();

        return ServiceResult<List<ProductoStockViewModel>>.Ok(stockBajo);
    }

    private static System.Linq.Expressions.Expression<Func<Producto, ProductoListViewModel>> ProyectarAListViewModel()
    {
        return p => new ProductoListViewModel
        {
            Id = p.Id,
            Nombre = p.Nombre,
            CodigoSKU = p.CodigoSKU,
            Descripcion = p.Descripcion,
            Precio = p.Precio,
            StockMinimo = p.StockMinimo,
            StockActual = p.MovimientosInventario.Sum(m =>
                m.TipoMovimiento == TipoMovimientoInventario.Entrada ? m.Cantidad : -m.Cantidad),
            CategoriaNombre = p.Categoria.Nombre,
            ProveedorNombre = p.Proveedor != null ? p.Proveedor.Nombre : null,
            Activo = p.Activo
        };
    }

    private static System.Linq.Expressions.Expression<Func<Producto, ProductoStockViewModel>> ProyectarAStockViewModel()
    {
        return p => new ProductoStockViewModel
        {
            ProductoId = p.Id,
            Nombre = p.Nombre,
            CodigoSKU = p.CodigoSKU,
            StockMinimo = p.StockMinimo,
            StockActual = p.MovimientosInventario.Sum(m =>
                m.TipoMovimiento == TipoMovimientoInventario.Entrada ? m.Cantidad : -m.Cantidad)
        };
    }
}
