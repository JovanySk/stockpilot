using InventorySystem_ASPNETCore.Common;
using InventorySystem_ASPNETCore.Data;
using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.Models;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem_ASPNETCore.Services;

public class ProveedorService : IProveedorService
{
    private readonly ApplicationDbContext _context;

    public ProveedorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<List<ProveedorViewModel>>> ObtenerActivosAsync()
    {
        var proveedores = await _context.Proveedores
            .Where(p => p.Activo)
            .OrderBy(p => p.Nombre)
            .Select(p => new ProveedorViewModel
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Contacto = p.Contacto,
                Telefono = p.Telefono,
                Email = p.Email,
                Direccion = p.Direccion,
                Activo = p.Activo,
                FechaCreacion = p.FechaCreacion,
                TotalProductosActivos = p.Productos.Count(pr => pr.Activo)
            })
            .ToListAsync();

        return ServiceResult<List<ProveedorViewModel>>.Ok(proveedores);
    }

    public async Task<ServiceResult<ProveedorViewModel>> ObtenerPorIdAsync(int id)
    {
        var proveedor = await _context.Proveedores
            .Where(p => p.Id == id)
            .Select(p => new ProveedorViewModel
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Contacto = p.Contacto,
                Telefono = p.Telefono,
                Email = p.Email,
                Direccion = p.Direccion,
                Activo = p.Activo,
                FechaCreacion = p.FechaCreacion,
                TotalProductosActivos = p.Productos.Count(pr => pr.Activo)
            })
            .FirstOrDefaultAsync();

        if (proveedor is null)
        {
            return ServiceResult<ProveedorViewModel>.Fail("El proveedor no existe.");
        }

        return ServiceResult<ProveedorViewModel>.Ok(proveedor);
    }

    public async Task<ServiceResult<int>> CrearAsync(ProveedorViewModel model)
    {
        var proveedor = new Proveedor
        {
            Nombre = model.Nombre.Trim(),
            Contacto = model.Contacto?.Trim(),
            Telefono = model.Telefono?.Trim(),
            Email = model.Email?.Trim(),
            Direccion = model.Direccion?.Trim(),
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Proveedores.Add(proveedor);
        await _context.SaveChangesAsync();

        return ServiceResult<int>.Ok(proveedor.Id, "Proveedor creado correctamente.");
    }

    public async Task<ServiceResult> ActualizarAsync(ProveedorViewModel model)
    {
        var proveedor = await _context.Proveedores.FindAsync(model.Id);
        if (proveedor is null)
        {
            return ServiceResult.Fail("El proveedor no existe.");
        }

        proveedor.Nombre = model.Nombre.Trim();
        proveedor.Contacto = model.Contacto?.Trim();
        proveedor.Telefono = model.Telefono?.Trim();
        proveedor.Email = model.Email?.Trim();
        proveedor.Direccion = model.Direccion?.Trim();
        proveedor.Activo = model.Activo;

        await _context.SaveChangesAsync();

        return ServiceResult.Ok("Proveedor actualizado correctamente.");
    }

    public async Task<ServiceResult> DesactivarAsync(int id)
    {
        var proveedor = await _context.Proveedores.FindAsync(id);
        if (proveedor is null)
        {
            return ServiceResult.Fail("El proveedor no existe.");
        }

        if (!proveedor.Activo)
        {
            return ServiceResult.Fail("El proveedor ya está desactivado.");
        }

        var productosActivos = await _context.Productos
            .CountAsync(p => p.ProveedorId == id && p.Activo);

        if (productosActivos > 0)
        {
            return ServiceResult.Fail(
                $"No se puede desactivar el proveedor porque tiene {productosActivos} producto(s) activo(s) asociado(s).");
        }

        proveedor.Activo = false;
        await _context.SaveChangesAsync();

        return ServiceResult.Ok("Proveedor desactivado correctamente.");
    }
}
