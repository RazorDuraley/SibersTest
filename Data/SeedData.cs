using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SibersTest.Models;

namespace SibersTest.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SibersDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roles = { "Admin", "ProjectManager", "Employee" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        var admin = new User
        {
            UserName = "admin@admin.com",
            Email = "admin@admin.com",
            FirstName = "Админ",
            LastName = "Админов"
        };
        if (await userManager.FindByEmailAsync(admin.Email) == null)
        {
            await userManager.CreateAsync(admin, "Admin123!");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        var manager = new User
        {
            UserName = "manager@manager.com",
            Email = "manager@manager.com",
            FirstName = "Менеджер",
            LastName = "Менеджеров"
        };
        if (await userManager.FindByEmailAsync(manager.Email) == null)
        {
            await userManager.CreateAsync(manager, "Manager123!");
            await userManager.AddToRoleAsync(manager, "ProjectManager");
        }

        var employee = new User
        {
            UserName = "employee@employee.com",
            Email = "employee@employee.com",
            FirstName = "Сотрудник",
            LastName = "Сотрудников"
        };
        if (await userManager.FindByEmailAsync(employee.Email) == null)
        {
            await userManager.CreateAsync(employee, "Employee123!");
            await userManager.AddToRoleAsync(employee, "Employee");
        }

        if (!context.Companies.Any())
        {
            context.Companies.AddRange(
                new Company { Name = "ООО Заказчик", Type = "Customer" },
                new Company { Name = "ООО Исполнитель", Type = "Executor" }
            );
            await context.SaveChangesAsync();
        }

        if (!context.Workers.Any())
        {
            context.Workers.AddRange(
                new Worker { FirstName = "Иван", LastName = "Иванов", Email = "ivan@mail.ru" },
                new Worker { FirstName = "Петр", LastName = "Петров", Email = "petr@mail.ru" },
                new Worker { FirstName = "Анна", LastName = "Смирнова", Email = "anna@mail.ru" }
            );
            await context.SaveChangesAsync();
        }

        if (!context.Projects.Any())
        {
            var workers = await context.Workers.ToListAsync();
            var companies = await context.Companies.ToListAsync();

            var project1 = new Project
            {
                Name = "Разработка CRM",
                Priority = 5,
                StartDate = new DateTime(2026, 1, 15),
                EndDate = new DateTime(2026, 6, 15),
                CustomerCompanyId = companies[0].Id,
                ExecutorCompanyId = companies[1].Id,
                ProjectManagerId = workers[0].Id
            };

            var project2 = new Project
            {
                Name = "Мобильное приложение",
                Priority = 8,
                StartDate = new DateTime(2026, 2, 1),
                EndDate = new DateTime(2026, 7, 1),
                CustomerCompanyId = companies[0].Id,
                ExecutorCompanyId = companies[1].Id,
                ProjectManagerId = workers[1].Id
            };

            context.Projects.AddRange(project1, project2);
            await context.SaveChangesAsync();

            var projects = await context.Projects.Include(p => p.Executors).ToListAsync();

            if (projects.Count >= 1 && workers.Count >= 2)
            {
                projects[0].Executors.Add(workers[0]);
                projects[0].Executors.Add(workers[1]);
            }

            if (projects.Count >= 2 && workers.Count >= 3)
            {
                projects[1].Executors.Add(workers[1]);
                projects[1].Executors.Add(workers[2]);
            }

            await context.SaveChangesAsync();
        }
    }
}