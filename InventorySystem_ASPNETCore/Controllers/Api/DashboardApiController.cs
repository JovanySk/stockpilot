using InventorySystem_ASPNETCore.Interfaces;
using InventorySystem_ASPNETCore.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem_ASPNETCore.Controllers.Api;

[ApiController]
[Route("api/dashboard")]
public class DashboardApiController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardApiController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(DashboardInventarioViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DashboardInventarioViewModel>> GetSummary()
    {
        var resultado = await _dashboardService.ObtenerResumenAsync();

        if (!resultado.Success || resultado.Data is null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, resultado.Message);
        }

        return Ok(resultado.Data);
    }
}
