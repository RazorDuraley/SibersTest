namespace SibersTest.Models;

public class FileUploadResult
{
    public string FileName { get; set; } = string.Empty;
    public long Size { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}