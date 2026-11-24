using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem_ASPNETCore.Controllers.Api;

[ApiController]
[Route("api/inventory")]
public class InventarioApiController : ControllerBase
{
    private readonly IInventarioService _inventarioService;

    public InventarioApiController(IInventarioService inventarioService)
    {
        _inventarioService = inventarioService;
    }

    [HttpGet("products/{productId:int}/movements")]
    [ProducesResponseType(typeof(List<MovimientoInventarioViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<List<MovimientoInventarioViewModel>>> GetMovements(int productId)
    {
        var resultado = await _inventarioService.ObtenerHistorialProductoAsync(productId);

        if (!resultado.Success || resultado.Data is null)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(resultado.Data);
    }

    [HttpGet("products/{productId:int}/stock")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStock(int productId)
    {
        var resultado = await _inventarioService.ObtenerStockActualAsync(productId);

        if (!resultado.Success)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(new { productId, stock = resultado.Data });
    }

    [HttpPost("entries")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegisterEntry([FromBody] MovimientoInventarioViewModel model)
    {
        var resultado = await _inventarioService.RegistrarEntradaAsync(model);
        return RespuestaMovimiento(resultado);
    }

    [HttpPost("outputs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegisterOutput([FromBody] MovimientoInventarioViewModel model)
    {
        var resultado = await _inventarioService.RegistrarSalidaAsync(model);
        return RespuestaMovimiento(resultado);
    }

    private IActionResult RespuestaMovimiento(
        Common.ServiceResult<MovimientoInventarioViewModel> resultado)
    {
        if (resultado.Success)
        {
            return Ok(new
            {
                success = true,
                message = resultado.Message,
                movimiento = resultado.Data
            });
        }

        if (resultado.Message.Contains("no existe", StringComparison.OrdinalIgnoreCase))
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return BadRequest(new { success = false, message = resultado.Message });
    }
}
