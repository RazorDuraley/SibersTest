using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SibersTest.Data;
using SibersTest.Models;

namespace SibersTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly SibersDbContext _context;

        public WorkersController(SibersDbContext context)
        {
            _context = context;
        }

        // GET: api/workers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetWorkers()
        {
            return await _context.Workers
                .Include(w => w.ManagedProjects)
                .Include(w => w.Projects)
                .ToListAsync();
        }

        // GET: api/workers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetWorker(int id)
        {
            var worker = await _context.Workers
                .Include(w => w.ManagedProjects)
                .Include(w => w.Projects)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (worker == null)
                return NotFound();

            return worker;
        }

        // POST: api/workers
        [HttpPost]
        public async Task<ActionResult<Worker>> PostWorker(Worker worker)
        {
            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorker), new { id = worker.Id }, worker);
        }

        // PUT: api/workers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorker(int id, Worker worker)
        {
            if (id != worker.Id)
                return BadRequest();

            _context.Entry(worker).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/workers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);
            if (worker == null)
                return NotFound();

            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}