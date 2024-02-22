using System;
using TodoApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddDbContext<ToDoDbContext>(options =>
{
    options.UseMySql(builder.Configuration.GetConnectionString("ToDoDB"), ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ToDoDB")));
});
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// הגדרת ה-Middleware של CORS
app.UseCors(policy =>
{
    policy.AllowAnyOrigin(); // מרשה גישה מכל מקור
    policy.AllowAnyMethod(); // מרשה כל פעולה (GET, POST, PUT, DELETE וכו')
    policy.AllowAnyHeader(); // מרשה כל כותרת בבקשה
});
// שליפת כל המשימות - GET request ל-/tasks
app.MapGet("/tasks", async (ToDoDbContext dbContext) =>
{
    var tasks = await dbContext.Items.ToListAsync(); // לשלוף את כל המשימות ממסד הנתונים
    return Results.Ok(tasks); // להחזיר רשימת המשימות כתשובה בפורמט JSON, לדוגמה
});

// הוספת משימה חדשה - POST request ל-/tasks
app.MapPost("/tasks", async (ToDoDbContext dbContext, HttpRequest request) =>
{
    var taskData = await request.ReadFromJsonAsync<Item>(); // לקרוא את נתוני המשימה החדשה מהבקשה
    var newTask = new Item { Name = taskData.Name }; // ליצור רשומת משימה חדשה
    dbContext.Items.Add(newTask); // להוסיף את המשימה החדשה למסד הנתונים
    await dbContext.SaveChangesAsync(); // לשמור את השינויים במסד הנתונים
    return Results.Created($"/tasks/{newTask.Id}", newTask); // להחזיר תשובת הצלחה עם מידע על המשימה החדשה
});

// עדכון משימה - PUT request ל-/tasks/{id}


app.MapPut("/tasks/{id}", async (ToDoDbContext dbContext, int id, HttpRequest request) =>
{
    var taskData = await request.ReadFromJsonAsync<Item>(); // לקרוא את נתוני המשימה המעודכנים מהבקשה
    var existingTask = await dbContext.Items.FindAsync(id); // למצוא את המשימה הקיימת במסד הנתונים על פי המזהה

    if (existingTask == null) // בדיקה אם המשימה לא נמצאה
    {
        return Results.NotFound(); // להחזיר תשובת טעות עם קוד 404 - לא נמצא
    }
 existingTask.Name = taskData.Name;// לעדכן את השדה של שם המשימה
    existingTask.Iscomplete = taskData.Iscomplete; // לעדכן את השדה של הסטטוס של המשימה

    await dbContext.SaveChangesAsync(); // לשמור את השינויים במסד הנתונים

    return Results.Ok(existingTask); // להחזיר תשובת הצלחה עם מידע על המשימה המעודכנת
});

// מחיקת משימה - DELETE request ל-/tasks/{id}
app.MapDelete("/tasks/{id}", async (int id, ToDoDbContext dbContext) =>
{
    var taskToRemove = await dbContext.Items.FindAsync(id); // למצוא את המשימה שיש למחוק לפי המזהה
    if (taskToRemove == null) return Results.NotFound(); // אם המשימה לא נמצאה, להחזיר שגיאת דרישה לא נמצא

    dbContext.Items.Remove(taskToRemove); // להסיר את המשימה ממסד הנתונים
    await dbContext.SaveChangesAsync(); // לשמור את השינויים במסד הנתונים
    return Results.Ok(); // להחזיר תשובת הצלחה
});

app.Run();
