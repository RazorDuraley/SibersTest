using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SibersTest.Models;

namespace SibersTest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Назначаем роль "Employee", если она существует
        if (await _roleManager.RoleExistsAsync("Employee"))
        {
            await _userManager.AddToRoleAsync(user, "Employee");
        }

        return Ok("Пользователь зарегистрирован");
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Email,
            user.FirstName,
            user.LastName,
            Roles = roles
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized("Неверный email или пароль");

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
        if (!result.Succeeded)
            return Unauthorized("Неверный email или пароль");

        return Ok("Вход выполнен");
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok("Выход выполнен");
    }

    [HttpPost("add-role")]
    public async Task<IActionResult> AddRole([FromBody] RoleModel model)
    {
        if (!await _roleManager.RoleExistsAsync(model.RoleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(model.RoleName));
        }
        return Ok($"Роль '{model.RoleName}' создана или уже существует");
    }
}

public class RegisterModel
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class LoginModel
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RoleModel
{
    public string RoleName { get; set; } = string.Empty;
}