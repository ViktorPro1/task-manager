# Task Manager — Backend

Сервер побудований на **Node.js + Express + PostgreSQL**.  
Відповідає за авторизацію користувачів та CRUD операції з задачами.

---

## Стек

- **Node.js** — середовище виконання JavaScript
- **Express** — веб-фреймворк для побудови API
- **PostgreSQL** — реляційна база даних
- **bcryptjs** — хешування паролів
- **jsonwebtoken** — генерація та перевірка JWT токенів
- **dotenv** — змінні середовища
- **cors** — дозвіл запитів з frontend
- **nodemon** — авторестарт сервера під час розробки

---

## Структура файлів

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       ├── auth.js
│       └── tasks.js
│   └── app.js
├── .env
├── package.json
└── server.js
```

---

## Опис файлів

### `server.js`

Точка входу в додаток. Завантажує змінні середовища з `.env` через `dotenv`, імпортує `app.js` і запускає HTTP сервер на вказаному порті.

---

### `src/app.js`

Створює і налаштовує Express додаток. Підключає middleware `cors` і `express.json()`, реєструє роути `/api/auth` і `/api/tasks`, експортує `app` для використання в `server.js`.

---

### `src/config/db.js`

Налаштовує підключення до PostgreSQL через `Pool` з бібліотеки `pg`. Зчитує параметри підключення (хост, порт, назва бази, юзер, пароль) зі змінних середовища. Експортує пул для використання в контролерах.

---

### `src/controllers/authController.js`

Містить два обробники:

- **`register`** — приймає `name`, `email`, `password`. Перевіряє чи email вже існує в базі. Хешує пароль через `bcryptjs`. Записує нового користувача в таблицю `users`. Повертає JWT токен і дані юзера.

- **`login`** — приймає `email`, `password`. Шукає юзера в базі за email. Порівнює пароль з хешем через `bcryptjs.compare`. Повертає JWT токен і дані юзера.

---

### `src/controllers/taskController.js`

Містить чотири обробники для роботи з задачами:

- **`getTasks`** — повертає всі задачі поточного користувача. Підтримує фільтрацію по статусу через query параметр `?status=active` або `?status=done`.

- **`createTask`** — створює нову задачу з полями `title` і `description`. Автоматично прив'язує задачу до поточного користувача через `user_id`. Статус за замовчуванням — `active`.

- **`updateTask`** — оновлює задачу за `id`. Приймає `title`, `description`, `status`. Перевіряє що задача належить поточному користувачу.

- **`deleteTask`** — видаляє задачу за `id`. Перевіряє що задача належить поточному користувачу.

---

### `src/middleware/authMiddleware.js`

Middleware для захисту роутів. Читає заголовок `Authorization: Bearer <token>`. Верифікує JWT токен через `jsonwebtoken`. Якщо токен валідний — додає `req.user` з даними юзера і передає запит далі. Якщо невалідний або відсутній — повертає `401 Unauthorized`.

---

### `src/routes/auth.js`

Реєструє два роути для авторизації:

- `POST /api/auth/register` → `authController.register`
- `POST /api/auth/login` → `authController.login`

---

### `src/routes/tasks.js`

Реєструє чотири роути для задач. Всі роути захищені через `authMiddleware`:

- `GET /api/tasks` → `taskController.getTasks`
- `POST /api/tasks` → `taskController.createTask`
- `PUT /api/tasks/:id` → `taskController.updateTask`
- `DELETE /api/tasks/:id` → `taskController.deleteTask`

---

### `.env`

Файл з конфіденційними змінними середовища. **Не додається в Git.** Містить параметри підключення до бази даних і секретний ключ для JWT.

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db
DB_USER=postgres
DB_PASSWORD=твій_пароль
JWT_SECRET=supersecretkey123
```

---

### `package.json`

Конфігурація проекту. Містить список залежностей і скрипти запуску:

- `npm start` — запуск в production режимі
- `npm run dev` — запуск через nodemon в dev режимі

---

## База даних

### Таблиця `users`

| Поле       | Тип                 | Опис                     |
| ---------- | ------------------- | ------------------------ |
| id         | SERIAL PRIMARY KEY  | Унікальний ідентифікатор |
| name       | VARCHAR(100)        | Ім'я користувача         |
| email      | VARCHAR(100) UNIQUE | Email (унікальний)       |
| password   | VARCHAR(255)        | Хешований пароль         |
| created_at | TIMESTAMP           | Дата реєстрації          |

### Таблиця `tasks`

| Поле        | Тип                | Опис                        |
| ----------- | ------------------ | --------------------------- |
| id          | SERIAL PRIMARY KEY | Унікальний ідентифікатор    |
| user_id     | INTEGER            | Зовнішній ключ на users     |
| title       | VARCHAR(255)       | Назва задачі                |
| description | TEXT               | Опис задачі                 |
| status      | VARCHAR(20)        | Статус: `active` або `done` |
| created_at  | TIMESTAMP          | Дата створення              |
