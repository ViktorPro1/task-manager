# Task Manager

Fullstack веб-додаток для управління задачами.  
Побудований як частина портфоліо для демонстрації навичок fullstack розробки.

---

## Про проект

Task Manager дозволяє користувачам створювати задачі, змінювати їх статус і фільтрувати по виконанню.  
Кожен користувач бачить тільки свої задачі — дані захищені авторизацією через JWT.

Проект демонструє вміння працювати з повним циклом розробки:  
від проектування бази даних і REST API до побудови React інтерфейсу.

---

## Функціонал

- Реєстрація та авторизація (JWT)
- Створення, редагування та видалення задач
- Зміна статусу задачі (активна / виконана)
- Фільтрація задач по статусу
- Захищені роути — дані доступні тільки авторизованому користувачу

---

## Стек технологій

**Backend**

- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs

**Frontend**

- React
- Vite
- React Router DOM
- Axios
- Context API

---

## Структура проекту

```
task-manager/
├── backend/      — REST API сервер
└── frontend/     — React клієнт
```

---

## Запуск локально

### Вимоги

- Node.js v18+
- PostgreSQL

### 1. Клонувати репозиторій

```bash
git clone https://github.com/ViktorPro1/task-manager.git
cd task-manager
```

### 2. Налаштувати backend

```bash
cd backend
npm install
```

Створи файл `.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db
DB_USER=postgres
DB_PASSWORD=твій_пароль
JWT_SECRET=твій_секретний_ключ
```

Створи базу даних і таблиці — SQL схема в файлі `backend/README.md`.

Запусти сервер:

```bash
npm run dev
```

### 3. Налаштувати frontend

```bash
cd frontend
npm install
```

Створи файл `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Запусти:

```bash
npm run dev
```

Відкрий `http://localhost:5173`

---

## База даних

### Таблиця `users`

| Поле       | Тип                 | Опис                     |
| ---------- | ------------------- | ------------------------ |
| id         | SERIAL PRIMARY KEY  | Унікальний ідентифікатор |
| name       | VARCHAR(100)        | Ім'я користувача         |
| email      | VARCHAR(100) UNIQUE | Email                    |
| password   | VARCHAR(255)        | Хешований пароль         |
| created_at | TIMESTAMP           | Дата реєстрації          |

### Таблиця `tasks`

| Поле        | Тип                | Опис                     |
| ----------- | ------------------ | ------------------------ |
| id          | SERIAL PRIMARY KEY | Унікальний ідентифікатор |
| user_id     | INTEGER            | Зовнішній ключ на users  |
| title       | VARCHAR(255)       | Назва задачі             |
| description | TEXT               | Опис задачі              |
| status      | VARCHAR(20)        | Статус: active або done  |
| created_at  | TIMESTAMP          | Дата створення           |

---

## API ендпоінти

### Auth

| Метод | URL                | Опис       |
| ----- | ------------------ | ---------- |
| POST  | /api/auth/register | Реєстрація |
| POST  | /api/auth/login    | Логін      |

### Tasks

| Метод  | URL            | Опис                |
| ------ | -------------- | ------------------- |
| GET    | /api/tasks     | Отримати всі задачі |
| POST   | /api/tasks     | Створити задачу     |
| PUT    | /api/tasks/:id | Оновити задачу      |
| DELETE | /api/tasks/:id | Видалити задачу     |

---

## Автор

**Viktor** — self-taught fullstack розробник.  
Активно будую портфоліо і шукаю першу комерційну практику або Junior позицію.  
Стек: React, Node.js, Express, PostgreSQL, Docker, Git.

GitHub: [github.com/ViktorPro1](https://github.com/ViktorPro1)
