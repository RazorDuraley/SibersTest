using Microsoft.AspNetCore.Mvc;
using SibersTest.Models;

namespace SibersTest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FilesController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public FilesController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<List<FileUploadResult>>> UploadFiles([FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest("Файлы не выбраны");

        var results = new List<FileUploadResult>();
        var uploadPath = Path.Combine(_env.WebRootPath, "uploads");

        if (!Directory.Exists(uploadPath))
            Directory.CreateDirectory(uploadPath);

        foreach (var file in files)
        {
            if (file.Length > 0)
            {
                var filePath = Path.Combine(uploadPath, file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                results.Add(new FileUploadResult
                {
                    FileName = file.FileName,
                    Size = file.Length,
                    ContentType = file.ContentType,
                    Message = "Успешно загружено"
                });
            }
        }

        return Ok(results);
    }
}