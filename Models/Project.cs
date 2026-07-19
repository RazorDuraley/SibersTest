using System.ComponentModel.DataAnnotations.Schema;

namespace SibersTest.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Priority { get; set; }

    // Связь с компаниями
    public int CustomerCompanyId { get; set; }
    public Company? CustomerCompany { get; set; }

    public int ExecutorCompanyId { get; set; }
    public Company? ExecutorCompany { get; set; }

    public List<ProjectFile> Files { get; set; } = new();
    public List<int> ExecutorIds { get; set; } = new();

    // Руководитель
    public int? ProjectManagerId { get; set; }
    public Worker? ProjectManager { get; set; }

    // Исполнители
    public List<Worker> Executors { get; set; } = new();
}