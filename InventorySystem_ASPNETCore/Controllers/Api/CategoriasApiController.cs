using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem_ASPNETCore.Controllers.Api;

[ApiController]
[Route("api/categories")]
public class CategoriasApiController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriasApiController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<CategoriaViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<CategoriaViewModel>>> GetCategories()
    {
        var resultado = await _categoriaService.ObtenerActivasAsync();

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
        var resultado = await _categoriaService.ObtenerActivasAsync();

        if (!resultado.Success || resultado.Data is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, resultado.Message);
        }

        return Ok(resultado.Data.Select(c => new { c.Id, c.Nombre }));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CategoriaViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoriaViewModel>> GetCategory(int id)
    {
        var resultado = await _categoriaService.ObtenerPorIdAsync(id);

        if (!resultado.Success || resultado.Data is null)
        {
            return NotFound(new { success = false, message = resultado.Message });
        }

        return Ok(resultado.Data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCategory([FromBody] CategoriaViewModel model)
    {
        var resultado = await _categoriaService.CrearAsync(model);

        if (!resultado.Success)
        {
            return BadRequest(new { success = false, message = resultado.Message });
        }

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = resultado.Data },
            new { success = true, message = resultado.Message, id = resultado.Data });
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoriaViewModel model)
    {
        model.Id = id;

        var resultado = await _categoriaService.ActualizarAsync(model);

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
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var resultado = await _categoriaService.DesactivarAsync(id);

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
