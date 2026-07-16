namespace SibersTest.Models
{
    public class Worker
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public int Id { get; set; }
        public string Role { get; set; }
        public string Mail { get; set; }


        // Проекты, где он является руководителем
        public List<Project> ManagedProjects { get; set; } = new();

        // Проекты, где он исполнитель (многие-ко-многим)
        public List<Project> Projects { get; set; } = new();

    }
}
