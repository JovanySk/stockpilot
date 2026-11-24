using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem_ASPNETCore.Controllers.Api;

[ApiController]
[Route("api/providers")]
public class ProveedoresApiController : ControllerBase
{
    private readonly IProveedorService _proveedorService;

    public ProveedoresApiController(IProveedorService proveedorService)
    {
        _proveedorService = proveedorService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<ProveedorViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<ProveedorViewModel>>> GetProviders()
    {
        var resultado = await _proveedorService.ObtenerActivosAsync();

        if (!resultado.Success || resultado.Data is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, resultado.Message);
        }

        return Ok(resultado.Data);
    }

    [HttpGet("options")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetOptions()
    {
        var resultado = await _proveedorService.ObtenerActivosAsync();

        if (!resultado.Success || resultado.Data is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, resultado.Message);
        }

        return Ok(resultado.Data.Select(p => new { p.Id, p.Nombre }));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProveedorViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProveedorViewModel>> GetProvider(int id)
    {
        var resultado = await _proveedorService.ObtenerPorIdAsync(id);

        if (!resultado.Success || resultado.Data is null)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(resultado.Data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProvider([FromBody] ProveedorViewModel model)
    {
        var resultado = await _proveedorService.CrearAsync(model);

        if (!resultado.Success)
        {
            return BadRequest(new { success = false, message = resultado.Message });
        }

        return CreatedAtAction(
            nameof(GetProvider),
            new { id = resultado.Data },
            new { success = true, message = resultado.Message, id = resultado.Data });
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProvider(int id, [FromBody] ProveedorViewModel model)
    {
        model.Id = id;

        var resultado = await _proveedorService.ActualizarAsync(model);

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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProvider(int id)
    {
        var resultado = await _proveedorService.DesactivarAsync(id);

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
