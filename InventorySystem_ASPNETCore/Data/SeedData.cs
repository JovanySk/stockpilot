using InventorySystem_ASPNETCore.Models;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem_ASPNETCore.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.MigrateAsync();

        if (await context.Productos.AnyAsync())
        {
            return;
        }

        var electronics = new Categoria
        {
            Nombre = "Electronics",
            Descripcion = "Electronic devices, components and accessories.",
            Activo = true
        };
        var officeSupplies = new Categoria
        {
            Nombre = "Office Supplies",
            Descripcion = "General office and stationery supplies.",
            Activo = true
        };
        var tools = new Categoria
        {
            Nombre = "Tools",
            Descripcion = "Hand tools and power tools for industrial use.",
            Activo = true
        };
        var cleaningSupplies = new Categoria
        {
            Nombre = "Cleaning Supplies",
            Descripcion = "Cleaning products and janitorial supplies.",
            Activo = true
        };

        var techSource = new Proveedor
        {
            Nombre = "TechSource MX",
            Contacto = "Laura Méndez",
            Telefono = "+52 55 1234 5678",
            Email = "ventas@techsourcemx.com",
            Direccion = "Av. Insurgentes Sur 1425, CDMX, México",
            Activo = true
        };
        var officeMart = new Proveedor
        {
            Nombre = "OfficeMart",
            Contacto = "Carlos Rivera",
            Telefono = "+52 55 8765 4321",
            Email = "contacto@officemart.com",
            Direccion = "Blvd. Manuel Ávila Camacho 36, Naucalpan, México",
            Activo = true
        };
        var industrialTools = new Proveedor
        {
            Nombre = "Industrial Tools Co.",
            Contacto = "Miguel Ángel Torres",
            Telefono = "+52 81 2345 6789",
            Email = "sales@industrialtools.co",
            Direccion = "Av. Universidad 602, Monterrey, México",
            Activo = true
        };
        var cleanPro = new Proveedor
        {
            Nombre = "CleanPro Supplier",
            Contacto = "Ana Gutiérrez",
            Telefono = "+52 33 9876 5432",
            Email = "pedidos@cleanpro.mx",
            Direccion = "Calz. Lázaro Cárdenas 3289, Guadalajara, México",
            Activo = true
        };

        var productos = new List<(Producto Producto, int StockInicial)>
        {
            (new Producto
            {
                Nombre = "Monitor LED 24\" Full HD",
                CodigoSKU = "ELEC-MON-024",
                Descripcion = "Monitor LED de 24 pulgadas, resolución 1920x1080, entrada HDMI y VGA.",
                Precio = 2899.00m,
                StockMinimo = 5,
                Categoria = electronics,
                Proveedor = techSource,
                Activo = true
            }, 25),
            (new Producto
            {
                Nombre = "Teclado mecánico USB",
                CodigoSKU = "ELEC-TEC-101",
                Descripcion = "Teclado mecánico retroiluminado, switches azules, layout en español.",
                Precio = 1149.50m,
                StockMinimo = 10,
                Categoria = electronics,
                Proveedor = techSource,
                Activo = true
            }, 40),
            (new Producto
            {
                Nombre = "Mouse inalámbrico ergonómico",
                CodigoSKU = "ELEC-MOU-205",
                Descripcion = "Mouse inalámbrico 2.4 GHz con receptor USB, 1600 DPI.",
                Precio = 449.00m,
                StockMinimo = 15,
                Categoria = electronics,
                Proveedor = techSource,
                Activo = true
            }, 60),
            (new Producto
            {
                Nombre = "Resma papel bond carta 500 hojas",
                CodigoSKU = "OFIC-PAP-500",
                Descripcion = "Resma de papel bond tamaño carta, 75 g/m², 500 hojas.",
                Precio = 129.90m,
                StockMinimo = 30,
                Categoria = officeSupplies,
                Proveedor = officeMart,
                Activo = true
            }, 200),
            (new Producto
            {
                Nombre = "Caja de bolígrafos azules (12 pzas)",
                CodigoSKU = "OFIC-BOL-012",
                Descripcion = "Caja con 12 bolígrafos de tinta azul, punto mediano.",
                Precio = 89.00m,
                StockMinimo = 20,
                Categoria = officeSupplies,
                Proveedor = officeMart,
                Activo = true
            }, 150),
            (new Producto
            {
                Nombre = "Taladro percutor 1/2\" 750W",
                CodigoSKU = "HERR-TAL-750",
                Descripcion = "Taladro percutor de 1/2 pulgada, 750 W, velocidad variable y reversible.",
                Precio = 1890.00m,
                StockMinimo = 3,
                Categoria = tools,
                Proveedor = industrialTools,
                Activo = true
            }, 12),
            (new Producto
            {
                Nombre = "Juego de desarmadores (6 pzas)",
                CodigoSKU = "HERR-DES-006",
                Descripcion = "Juego de 6 desarmadores punta plana y cruz, mangos antiderrapantes.",
                Precio = 349.00m,
                StockMinimo = 8,
                Categoria = tools,
                Proveedor = industrialTools,
                Activo = true
            }, 30),
            (new Producto
            {
                Nombre = "Limpiador multiusos 1L",
                CodigoSKU = "LIMP-MUL-001",
                Descripcion = "Limpiador líquido multiusos aroma lavanda, botella de 1 litro.",
                Precio = 45.50m,
                StockMinimo = 25,
                Categoria = cleaningSupplies,
                Proveedor = cleanPro,
                Activo = true
            }, 120),
            (new Producto
            {
                Nombre = "Paquete de microfibras (10 pzas)",
                CodigoSKU = "LIMP-MIC-010",
                Descripcion = "Paquete de 10 paños de microfibra 40x40 cm para limpieza general.",
                Precio = 159.00m,
                StockMinimo = 12,
                Categoria = cleaningSupplies,
                Proveedor = cleanPro,
                Activo = true
            }, 80)
        };

        foreach (var (producto, stockInicial) in productos)
        {
            producto.MovimientosInventario.Add(new MovimientoInventario
            {
                TipoMovimiento = TipoMovimientoInventario.Entrada,
                Cantidad = stockInicial,
                Motivo = "Initial stock load",
                UsuarioRegistro = "System Seed",
                Observaciones = "Carga inicial de inventario generada por el seed de desarrollo."
            });
        }

        context.Productos.AddRange(productos.Select(p => p.Producto));

        await context.SaveChangesAsync();
    }
}
