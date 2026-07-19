namespace SibersTest.Models;

public class Worker
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string Email { get; set; } = string.Empty;

    public List<Project> ManagedProjects { get; set; } = new();
    public List<Project> Projects { get; set; } = new();
}