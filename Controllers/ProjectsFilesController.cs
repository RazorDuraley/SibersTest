using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SibersTest.Data;
using SibersTest.Models;

namespace SibersTest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectFilesController : ControllerBase
{
    private readonly SibersDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProjectFilesController(SibersDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET: api/projectfiles/{projectId}
    [HttpGet("{projectId}")]
    public async Task<ActionResult<IEnumerable<ProjectFile>>> GetFiles(int projectId)
    {
        return await _context.ProjectFiles
            .Where(f => f.ProjectId == projectId)
            .ToListAsync();
    }

    // POST: api/projectfiles/{projectId}
    [HttpPost("{projectId}")]
    public async Task<ActionResult<IEnumerable<ProjectFile>>> UploadFiles(int projectId, [FromForm] List<IFormFile> files)
    {
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
            return NotFound("Проект не найден");

        var uploadPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", projectId.ToString());
        if (!Directory.Exists(uploadPath))
            Directory.CreateDirectory(uploadPath);

        var uploadedFiles = new List<ProjectFile>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var projectFile = new ProjectFile
            {
                FileName = file.FileName,
                FilePath = $"/uploads/{projectId}/{fileName}",
                FileSize = file.Length,
                ProjectId = projectId
            };

            _context.ProjectFiles.Add(projectFile);
            uploadedFiles.Add(projectFile);
        }

        await _context.SaveChangesAsync();
        return Ok(uploadedFiles);
    }

    // DELETE: api/projectfiles/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFile(int id)
    {
        var file = await _context.ProjectFiles.FindAsync(id);
        if (file == null)
            return NotFound();

        var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", file.FilePath.TrimStart('/'));
        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        _context.ProjectFiles.Remove(file);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}