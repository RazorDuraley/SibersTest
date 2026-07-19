namespace SibersTest.Models;

public enum TaskStatus
{
    ToDo,
    InProgress,
    Done
}

public class TaskItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public int Priority { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.ToDo;

    public int ProjectId { get; set; }
    public Project? Project { get; set; }

    public int AuthorId { get; set; }
    public Worker? Author { get; set; }

    public int? ExecutorId { get; set; }
    public Worker? Executor { get; set; }
}