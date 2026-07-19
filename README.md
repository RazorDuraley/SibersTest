\# 📁 Управление проектами (SibersTest)



Веб-приложение для управления проектами, сотрудниками и задачами. Разработано в рамках тестового задания для Sibers.



\---



\## 🚀 Технологии



\- \*\*Бэкенд:\*\* ASP.NET Core 8, Entity Framework Core, SQL Server

\- \*\*Фронтенд:\*\* React, Axios, React Router

\- \*\*Авторизация:\*\* ASP.NET Core Identity (роли: Admin, ProjectManager, Employee)



\---



\## 📦 Функциональность



\### ✅ Проекты

\- CRUD (создание, просмотр, редактирование, удаление)

\- Фильтрация по дате начала и приоритету

\- Сортировка по названию, дате, приоритету

\- Wizard из 5 шагов при создании

\- Модальное окно для полного редактирования



\### ✅ Сотрудники

\- CRUD (только для Admin)

\- Редактирование всех полей (имя, фамилия, отчество, email)



\### ✅ Задачи

\- CRUD (для проектов)

\- Изменение статуса (ToDo → InProgress → Done)



\### ✅ Файлы

\- Drag \& Drop загрузка файлов

\- Привязка файлов к проектам



\### ✅ Авторизация

\- Три роли: Admin, ProjectManager, Employee

\- UI адаптирован под роль пользователя

\- Кнопки управления скрыты для неавторизованных



\---



\## 🛠️ Запуск проекта



\### 1. Бэкенд

```bash

cd SibersTest

dotnet restore

dotnet ef database update

dotnet run

2. Фронтенд
bash
cd frontend
npm install
npm start
3. Тестовые пользователи
Email	Пароль	Роль
admin@admin.com	Admin123!	Admin
manager@manager.com	Manager123!	ProjectManager
(любой другой)	любой	Employee

📌 Примечания
База данных создаётся автоматически через миграции.

Файлы загружаются в папку wwwroot/uploads/.

Swagger доступен по адресу: http://localhost:5153/swagger.