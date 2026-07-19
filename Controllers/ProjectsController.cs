using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SibersTest.Data;
using SibersTest.Models;

namespace SibersTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, ProjectManager, Employee")]
    public class ProjectsController : ControllerBase
    {
        private readonly SibersDbContext _context;

        public ProjectsController(SibersDbContext context)
        {
            _context = context;
        }

        // GET: api/projects (Все роли могут просматривать)
        [HttpGet]
        [Authorize(Roles = "Admin, ProjectManager, Employee")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects(
            DateTime? startDateFrom, DateTime? startDateTo,
            int? priorityFrom, int? priorityTo,
            string? orderBy, bool? descending)
        {
            var query = _context.Projects
                .Include(p => p.CustomerCompany)
                .Include(p => p.ExecutorCompany)
                .Include(p => p.ProjectManager)
                .AsQueryable();

            if (startDateFrom.HasValue)
                query = query.Where(p => p.StartDate >= startDateFrom.Value);
            if (startDateTo.HasValue)
                query = query.Where(p => p.StartDate <= startDateTo.Value);
            if (priorityFrom.HasValue)
                query = query.Where(p => p.Priority >= priorityFrom.Value);
            if (priorityTo.HasValue)
                query = query.Where(p => p.Priority <= priorityTo.Value);

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
        [Authorize(Roles = "Admin, ProjectManager, Employee")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.CustomerCompany)
                .Include(p => p.ExecutorCompany)
                .Include(p => p.ProjectManager)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            return project;
        }

        // POST: api/projects
        [HttpPost]
        [Authorize(Roles = "Admin, ProjectManager")]
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            if (project.ProjectManagerId.HasValue)
            {
                var manager = await _context.Workers.FindAsync(project.ProjectManagerId.Value);
                if (manager == null)
                    return BadRequest("Руководитель не найден");
            }

            if (project.ExecutorIds != null && project.ExecutorIds.Any())
            {
                var executors = await _context.Workers
                    .Where(w => project.ExecutorIds.Contains(w.Id))
                    .ToListAsync();
                project.Executors = executors;
            }

            project.ProjectManager = null;
            project.CustomerCompany = null;
            project.ExecutorCompany = null;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var createdProject = await _context.Projects
                .Include(p => p.CustomerCompany)
                .Include(p => p.ExecutorCompany)
                .Include(p => p.ProjectManager)
                .FirstOrDefaultAsync(p => p.Id == project.Id);

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, createdProject);
        }

        // PUT: api/projects/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, ProjectManager")]
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
        [Authorize(Roles = "Admin")]
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