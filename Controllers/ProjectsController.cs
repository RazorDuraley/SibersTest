using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SibersTest.Data;
using SibersTest.Models;

namespace SibersTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly SibersDbContext _context;

        public ProjectsController(SibersDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects(
    DateTime? startDateFrom, DateTime? startDateTo,
    int? priorityFrom, int? priorityTo,
    string? orderBy, bool? descending)
        {
            var query = _context.Projects
                .Include(p => p.CustomerCompany)
                .Include(p => p.ExecutorCompany)
                .Include(p => p.ProjectManager)
                .Include(p => p.Executors)
                .AsQueryable();

            // Фильтрация по дате начала
            if (startDateFrom.HasValue)
                query = query.Where(p => p.StartDate >= startDateFrom.Value);
            if (startDateTo.HasValue)
                query = query.Where(p => p.StartDate <= startDateTo.Value);

            // Фильтрация по приоритету
            if (priorityFrom.HasValue)
                query = query.Where(p => p.Priority >= priorityFrom.Value);
            if (priorityTo.HasValue)
                query = query.Where(p => p.Priority <= priorityTo.Value);

            // Сортировка
            if (!string.IsNullOrEmpty(orderBy))
            {
                query = orderBy.ToLower() switch
                {
                    "name" => descending == true ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                    "startdate" => descending == true ? query.OrderByDescending(p => p.StartDate) : query.OrderBy(p => p.StartDate),
                    "priority" => descending == true ? query.OrderByDescending(p => p.Priority) : query.OrderBy(p => p.Priority),
                    _ => query
                };
            }

            return await query.ToListAsync();
        }

        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.CustomerCompany)
                .Include(p => p.ExecutorCompany)
                .Include(p => p.ProjectManager)
                .Include(p => p.Executors)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            return project;
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            // Проверяем, что руководитель существует (если указан)
            if (project.ProjectManagerId.HasValue)
            {
                var manager = await _context.Workers.FindAsync(project.ProjectManagerId.Value);
                if (manager == null)
                    return BadRequest("Project manager not found");
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, Project project)
        {
            if (id != project.Id)
                return BadRequest();

            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}