using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.Data;
using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.Models;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem_ASPNETCore.Services;

public class CategoriaService : ICategoriaService
{
    private readonly ApplicationDbContext _context;

    public CategoriaService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<List<CategoriaViewModel>>> ObtenerActivasAsync()
    {
        var categorias = await _context.Categorias
            .Where(c => c.Activo)
            .OrderBy(c => c.Nombre)
            .Select(c => new CategoriaViewModel
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Activo = c.Activo,
                FechaCreacion = c.FechaCreacion,
                TotalProductosActivos = c.Productos.Count(p => p.Activo)
            })
            .ToListAsync();

        return ServiceResult<List<CategoriaViewModel>>.Ok(categorias);
    }

    public async Task<ServiceResult<CategoriaViewModel>> ObtenerPorIdAsync(int id)
    {
        var categoria = await _context.Categorias
            .Where(c => c.Id == id)
            .Select(c => new CategoriaViewModel
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Activo = c.Activo,
                FechaCreacion = c.FechaCreacion,
                TotalProductosActivos = c.Productos.Count(p => p.Activo)
            })
            .FirstOrDefaultAsync();

        if (categoria is null)
        {
            return ServiceResult<CategoriaViewModel>.Fail("La categoría no existe.");
        }

        return ServiceResult<CategoriaViewModel>.Ok(categoria);
    }

    public async Task<ServiceResult<int>> CrearAsync(CategoriaViewModel model)
    {
        var nombre = model.Nombre.Trim();

        if (await ExisteNombreAsync(nombre, null))
        {
            return ServiceResult<int>.Fail($"Ya existe una categoría con el nombre '{nombre}'.");
        }

        var categoria = new Categoria
        {
            Nombre = nombre,
            Descripcion = model.Descripcion?.Trim(),
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return ServiceResult<int>.Ok(categoria.Id, "Categoría creada correctamente.");
    }

    public async Task<ServiceResult> ActualizarAsync(CategoriaViewModel model)
    {
        var categoria = await _context.Categorias.FindAsync(model.Id);
        if (categoria is null)
        {
            return ServiceResult.Fail("La categoría no existe.");
        }

        var nombre = model.Nombre.Trim();

        if (await ExisteNombreAsync(nombre, model.Id))
        {
            return ServiceResult.Fail($"Ya existe otra categoría con el nombre '{nombre}'.");
        }

        categoria.Nombre = nombre;
        categoria.Descripcion = model.Descripcion?.Trim();
        categoria.Activo = model.Activo;

        await _context.SaveChangesAsync();

        return ServiceResult.Ok("Categoría actualizada correctamente.");
    }

    public async Task<ServiceResult> DesactivarAsync(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);
        if (categoria is null)
        {
            return ServiceResult.Fail("La categoría no existe.");
        }

        if (!categoria.Activo)
        {
            return ServiceResult.Fail("La categoría ya está desactivada.");
        }

        var productosActivos = await _context.Productos
            .CountAsync(p => p.CategoriaId == id && p.Activo);

        if (productosActivos > 0)
        {
            return ServiceResult.Fail(
                $"No se puede desactivar la categoría porque tiene {productosActivos} producto(s) activo(s) asociado(s).");
        }

        categoria.Activo = false;
        await _context.SaveChangesAsync();

        return ServiceResult.Ok("Categoría desactivada correctamente.");
    }

    private async Task<bool> ExisteNombreAsync(string nombre, int? excluirId)
    {
        return await _context.Categorias
            .AnyAsync(c => c.Nombre == nombre && (excluirId == null || c.Id != excluirId));
    }
}
