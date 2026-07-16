namespace SibersTest.Models
{

    public class Project
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Priority { get; set; }


        public int? CustomerCompanyId { get; set; }
        public CustomerCompany? CustomerCompany { get; set; } = null!;

        public int? ExecutorCompanyId { get; set; }
        public ExecutorCompany? ExecutorCompany { get; set; } = null!;

        public int? ProjectManagerId { get; set; }
        public Worker? ProjectManager { get; set; }

        public List<Worker> Executors { get; set; } = new();
    }
}
