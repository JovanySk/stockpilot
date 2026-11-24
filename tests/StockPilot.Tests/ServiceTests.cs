using Xunit;
using InventorySystem_ASPNETCore.Data;
using InventorySystem_ASPNETCore.Models;
using InventorySystem_ASPNETCore.Services;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace StockPilot.Tests;

/// <summary>
/// Each test gets a fresh SQLite in-memory database, so relational rules
/// (FKs, unique SKU index, SUM aggregates) behave like a real database.
/// </summary>
public sealed class TestDb : IDisposable
{
    private readonly SqliteConnection _connection;
    public ApplicationDbContext Context { get; }

    public TestDb()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlite(_connection).Options;
        Context = new ApplicationDbContext(options);
        Context.Database.EnsureCreated();
    }

    public Producto SeedProducto(string sku = "SKU-001", int stockMinimo = 5, bool activo = true)
    {
        var categoria = Context.Categorias.FirstOrDefault() ?? Context.Categorias.Add(new Categoria { Nombre = "Herramientas" }).Entity;
        var producto = new Producto { Nombre = "Taladro " + sku, CodigoSKU = sku, Precio = 999m, StockMinimo = stockMinimo, Categoria = categoria, Activo = activo };
        Context.Productos.Add(producto);
        Context.SaveChanges();
        return producto;
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}

public class InventarioServiceTests
{
    private static MovimientoInventarioViewModel Mov(int productoId, int cantidad, string motivo = "Compra")
        => new() { ProductoId = productoId, Cantidad = cantidad, Motivo = motivo };

    [Fact]
    public async Task Entrada_incrementa_el_stock()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var service = new InventarioService(db.Context);

        var result = await service.RegistrarEntradaAsync(Mov(p.Id, 10));

        Assert.True(result.Success);
        Assert.Equal(10, (await service.ObtenerStockActualAsync(p.Id)).Data);
    }

    [Fact]
    public async Task Salida_descuenta_del_stock()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var service = new InventarioService(db.Context);
        await service.RegistrarEntradaAsync(Mov(p.Id, 10));

        var result = await service.RegistrarSalidaAsync(Mov(p.Id, 4, "Venta"));

        Assert.True(result.Success);
        Assert.Equal(6, (await service.ObtenerStockActualAsync(p.Id)).Data);
    }

    [Fact]
    public async Task Salida_mayor_al_stock_es_rechazada_y_no_altera_el_stock()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var service = new InventarioService(db.Context);
        await service.RegistrarEntradaAsync(Mov(p.Id, 3));

        var result = await service.RegistrarSalidaAsync(Mov(p.Id, 5, "Venta"));

        Assert.False(result.Success);
        Assert.Contains("excede el stock disponible (3)", result.Message);
        Assert.Equal(3, (await service.ObtenerStockActualAsync(p.Id)).Data);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-4)]
    public async Task Cantidad_no_positiva_es_rechazada(int cantidad)
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var result = await new InventarioService(db.Context).RegistrarEntradaAsync(Mov(p.Id, cantidad));

        Assert.False(result.Success);
        Assert.Equal("La cantidad debe ser mayor que 0.", result.Message);
    }

    [Fact]
    public async Task Motivo_es_obligatorio()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var result = await new InventarioService(db.Context).RegistrarEntradaAsync(Mov(p.Id, 1, "   "));

        Assert.False(result.Success);
        Assert.Equal("El motivo del movimiento es obligatorio.", result.Message);
    }

    [Fact]
    public async Task Producto_inactivo_no_acepta_movimientos()
    {
        using var db = new TestDb();
        var p = db.SeedProducto(activo: false);
        var result = await new InventarioService(db.Context).RegistrarEntradaAsync(Mov(p.Id, 1));

        Assert.False(result.Success);
        Assert.Contains("producto inactivo", result.Message);
    }

    [Fact]
    public async Task Producto_inexistente_es_rechazado()
    {
        using var db = new TestDb();
        var service = new InventarioService(db.Context);

        Assert.False((await service.RegistrarEntradaAsync(Mov(999, 1))).Success);
        Assert.False((await service.ObtenerStockActualAsync(999)).Success);
        Assert.False((await service.ObtenerHistorialProductoAsync(999)).Success);
    }

    [Fact]
    public async Task Historial_devuelve_movimientos_del_mas_reciente_al_mas_antiguo()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var service = new InventarioService(db.Context);
        await service.RegistrarEntradaAsync(Mov(p.Id, 10, "Compra inicial"));
        await Task.Delay(20);
        await service.RegistrarSalidaAsync(Mov(p.Id, 2, "Venta mostrador"));

        var historial = (await service.ObtenerHistorialProductoAsync(p.Id)).Data!;

        Assert.Equal(2, historial.Count);
        Assert.Equal("Venta mostrador", historial[0].Motivo);
        Assert.Equal("Compra inicial", historial[1].Motivo);
    }
}

public class ProductoServiceTests
{
    private static ProductoCreateViewModel NuevoProducto(int categoriaId, string sku) => new()
    {
        Nombre = "Martillo",
        CodigoSKU = sku,
        Precio = 150m,
        StockMinimo = 2,
        CategoriaId = categoriaId
    };

    [Fact]
    public async Task Crear_producto_valido()
    {
        using var db = new TestDb();
        var categoria = db.Context.Categorias.Add(new Categoria { Nombre = "Ferretería" }).Entity;
        db.Context.SaveChanges();

        var result = await new ProductoService(db.Context).CrearAsync(NuevoProducto(categoria.Id, "MAR-01"));

        Assert.True(result.Success);
        Assert.True(result.Data > 0);
    }

    [Fact]
    public async Task SKU_duplicado_es_rechazado()
    {
        using var db = new TestDb();
        var existente = db.SeedProducto("DUP-01");

        var result = await new ProductoService(db.Context).CrearAsync(NuevoProducto(existente.CategoriaId, "DUP-01"));

        Assert.False(result.Success);
        Assert.Contains("DUP-01", result.Message);
    }

    [Fact]
    public async Task Categoria_inexistente_es_rechazada()
    {
        using var db = new TestDb();
        var result = await new ProductoService(db.Context).CrearAsync(NuevoProducto(12345, "X-1"));

        Assert.False(result.Success);
        Assert.Contains("categoría", result.Message);
    }

    [Fact]
    public async Task Stock_bajo_detecta_productos_en_o_por_debajo_del_minimo()
    {
        using var db = new TestDb();
        var bajo = db.SeedProducto("LOW-1", stockMinimo: 5);
        var ok = db.SeedProducto("OK-1", stockMinimo: 5);
        var inventario = new InventarioService(db.Context);
        await inventario.RegistrarEntradaAsync(new MovimientoInventarioViewModel { ProductoId = bajo.Id, Cantidad = 5, Motivo = "Compra" });
        await inventario.RegistrarEntradaAsync(new MovimientoInventarioViewModel { ProductoId = ok.Id, Cantidad = 20, Motivo = "Compra" });

        var lista = (await new ProductoService(db.Context).ObtenerProductosStockBajoAsync()).Data!;

        Assert.Single(lista);
        Assert.Equal("LOW-1", lista[0].CodigoSKU);
        Assert.True(lista[0].StockBajo);
    }

    [Fact]
    public async Task Desactivar_dos_veces_devuelve_error()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();
        var service = new ProductoService(db.Context);

        Assert.True((await service.DesactivarAsync(p.Id)).Success);
        var segunda = await service.DesactivarAsync(p.Id);

        Assert.False(segunda.Success);
        Assert.Equal("El producto ya está desactivado.", segunda.Message);
    }
}

public class CategoriaServiceTests
{
    [Fact]
    public async Task No_se_puede_desactivar_una_categoria_con_productos_activos()
    {
        using var db = new TestDb();
        var p = db.SeedProducto();

        var result = await new CategoriaService(db.Context).DesactivarAsync(p.CategoriaId);

        Assert.False(result.Success);
        Assert.Contains("1 producto(s) activo(s)", result.Message);
    }

    [Fact]
    public async Task Nombre_de_categoria_duplicado_es_rechazado()
    {
        using var db = new TestDb();
        var service = new CategoriaService(db.Context);
        Assert.True((await service.CrearAsync(new CategoriaViewModel { Nombre = "Pinturas" })).Success);

        var duplicada = await service.CrearAsync(new CategoriaViewModel { Nombre = "Pinturas" });

        Assert.False(duplicada.Success);
    }
}
