using Microsoft.AspNetCore.Mvc;

namespace WarpPowerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PowersController : ControllerBase
{
    private static readonly List<WarpPower> Powers = new()
    {
        new WarpPower { Id = 1, Name = "Teleportation", Description = "Instantly travel to any location", PowerLevel = 95 },
        new WarpPower { Id = 2, Name = "Time Manipulation", Description = "Control the flow of time", PowerLevel = 100 },
        new WarpPower { Id = 3, Name = "Space Bending", Description = "Bend space to your will", PowerLevel = 88 },
        new WarpPower { Id = 4, Name = "Reality Shift", Description = "Alter the fabric of reality", PowerLevel = 92 }
    };

    [HttpGet]
    public ActionResult<IEnumerable<WarpPower>> GetAll()
    {
        return Ok(Powers);
    }

    [HttpGet("{id}")]
    public ActionResult<WarpPower> GetById(int id)
    {
        var power = Powers.FirstOrDefault(p => p.Id == id);
        if (power == null)
            return NotFound();
        
        return Ok(power);
    }

    [HttpPost]
    public ActionResult<WarpPower> Create(CreateWarpPowerDto dto)
    {
        var newPower = new WarpPower
        {
            Id = Powers.Max(p => p.Id) + 1,
            Name = dto.Name,
            Description = dto.Description,
            PowerLevel = dto.PowerLevel
        };
        
        Powers.Add(newPower);
        return CreatedAtAction(nameof(GetById), new { id = newPower.Id }, newPower);
    }
}

public record WarpPower
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int PowerLevel { get; set; }
}

public record CreateWarpPowerDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int PowerLevel { get; set; }
}
