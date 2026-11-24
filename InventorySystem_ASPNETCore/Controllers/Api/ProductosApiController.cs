using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem_ASPNETCore.Controllers.Api;

[ApiController]
[Route("api/products")]
public class ProductosApiController : ControllerBase
{
    private readonly IProductoService _productoService;

    public ProductosApiController(IProductoService productoService)
    {
        _productoService = productoService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<ProductoListViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<ProductoListViewModel>>> GetProducts(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] int? providerId,
        [FromQuery] bool lowStock = false)
    {
        var filtro = new ProductoFiltroViewModel
        {
            Texto = search,
            CategoriaId = categoryId,
            ProveedorId = providerId,
            SoloStockBajo = lowStock
        };

        var resultado = await _productoService.FiltrarAsync(filtro);

        if (!resultado.Success || resultado.Data is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, resultado.Message);
        }

        return Ok(resultado.Data);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductoListViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductoListViewModel>> GetProduct(int id)
    {
        var resultado = await _productoService.ObtenerPorIdAsync(id);

        if (!resultado.Success || resultado.Data is null)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(resultado.Data);
    }

    [HttpGet("{id:int}/stock")]
    [ProducesResponseType(typeof(ProductoStockViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductoStockViewModel>> GetProductStock(int id)
    {
        var resultado = await _productoService.ObtenerStockAsync(id);

        if (!resultado.Success || resultado.Data is null)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(resultado.Data);
    }

    [HttpGet("{id:int}/edit")]
    [ProducesResponseType(typeof(ProductoEditViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductoEditViewModel>> GetProductForEdit(int id)
    {
        var resultado = await _productoService.ObtenerParaEditarAsync(id);

        if (!resultado.Success || resultado.Data is null)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(resultado.Data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProduct([FromBody] ProductoCreateViewModel model)
    {
        var resultado = await _productoService.CrearAsync(model);

        if (!resultado.Success)
        {
            return BadRequest(new { success = false, message = resultado.Message });
        }

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = resultado.Data },
            new { success = true, message = resultado.Message, id = resultado.Data });
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductoEditViewModel model)
    {
        model.Id = id;

        var resultado = await _productoService.ActualizarAsync(model);

        if (resultado.Success)
        {
            return Ok(new { success = true, message = resultado.Message });
        }

        if (resultado.Message.Contains("no existe", StringComparison.OrdinalIgnoreCase))
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return BadRequest(new { success = false, message = resultado.Message });
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var resultado = await _productoService.DesactivarAsync(id);

        if (resultado.Success)
        {
            return Ok(new { success = true, message = resultado.Message });
        }

        if (resultado.Message.Contains("no existe", StringComparison.OrdinalIgnoreCase))
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return BadRequest(new { success = false, message = resultado.Message });
    }
}
