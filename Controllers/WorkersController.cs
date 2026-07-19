using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SibersTest.Data;
using SibersTest.Models;

namespace SibersTest.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin, ProjectManager")]
public class WorkersController : ControllerBase
{
    private readonly SibersDbContext _context;

    public WorkersController(SibersDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin, ProjectManager, Employee")]
    public async Task<ActionResult<IEnumerable<Worker>>> GetWorkers()
    {
        return await _context.Workers.ToListAsync();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Worker>>> SearchWorkers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return await _context.Workers.Take(10).ToListAsync();

        return await _context.Workers
            .Where(w => w.FirstName.Contains(query) ||
                        w.LastName.Contains(query) ||
                        w.Email.Contains(query))
            .Take(10)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin, ProjectManager, Employee")]
    public async Task<ActionResult<Worker>> GetWorker(int id)
    {
        var worker = await _context.Workers.FindAsync(id);
        if (worker == null) return NotFound();
        return worker;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Worker>> PostWorker(Worker worker)
    {
        _context.Workers.Add(worker);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWorker), new { id = worker.Id }, worker);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutWorker(int id, Worker worker)
    {
        if (id != worker.Id) return BadRequest();

        var existing = await _context.Workers.FindAsync(id);
        if (existing == null) return NotFound();

        existing.FirstName = worker.FirstName;
        existing.LastName = worker.LastName;
        existing.Patronymic = worker.Patronymic;
        existing.Email = worker.Email;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteWorker(int id)
    {
        var worker = await _context.Workers.FindAsync(id);
        if (worker == null) return NotFound();
        _context.Workers.Remove(worker);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}