# 🔐 ABAC Portal - Attribute-Based Access Control Platform

Полнофункциональная платформа для моделирования и тестирования разграничения доступа на основе атрибутов (Attribute-Based Access Control).

## 📋 Описание

Этот проект демонстрирует работу ABAC (Attribute-Based Access Control) системы с использованием:
- **Backend**: FastAPI + Casbin
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## 🚀 Быстрый старт

### Предварительные требования

- Docker
- Docker Compose

### Запуск проекта

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/abac-portal
cd abac-portal

# Запустить сервисы (только backend + postgres)
docker compose up --build

# Или в фоновом режиме
docker compose up -d
```

После запуска:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/docs
- **PostgreSQL**: localhost:5432

## 🧩 Архитектура

```
┌────────────────────────────────────────────┐
│        BACKEND (FastAPI + Casbin)          │
│  /auth   - проверка доступа                │
│  /auth/web - доступ к веб-ресурсам         │
│  /users  - управление пользователями       │
│  /documents   - работа с документами       │
│  /policies - управление политиками         │
│  /column-policies - политики по колонкам   │
│  /logs   - просмотр логов доступа          │
└──────────────┬─────────────────────────────┘
               │
┌──────────────▼─────────────────────────────┐
│      PostgreSQL Database                    │
│  - users                                    │
│  - documents                                │
│  - access_logs                              │
└────────────────────────────────────────────┘
```

## 📁 Структура проекта

```
.
├── backend/
│   ├── main.py                 # FastAPI сервер
│   ├── casbin_model.conf       # Модель Casbin
│   ├── casbin_policy.csv       # Политики доступа
│   ├── init_db.sql             # SQL схема и начальные данные
│   ├── requirements.txt         # Python зависимости
│   └── Dockerfile               # Docker конфигурация
├── docker-compose.yml          # Docker Compose конфигурация
├── abac-frontend/              # React + Vite фронтенд
│   ├── Dockerfile              # Сборка и nginx
│   └── nginx.conf
├── docs/
│   └── ABAC_USAGE.md           # Руководство по использованию ABAC
└── README.md

```

## 🎯 Основные возможности

### 1. Тест ABAC через API
- Проверка доступа к документам через `POST /auth`
- Проверка доступа к веб-ресурсам (например, GitHub) через `POST /auth/web`

### 2. Управление пользователями (🧑 Пользователи)
- Просмотр всех пользователей
- Добавление новых пользователей
- Редактирование атрибутов пользователей
- Удаление пользователей

### 3. Управление документами (📄 Документы)
- Просмотр всех документов
- Добавление новых документов
- Настройка департамента, статуса и конфиденциальности

### 4. Управление политиками (⚙️ Политики)
- Просмотр всех Casbin политик
- Добавление новых правил доступа
- Удаление существующих правил

### 5. Просмотр логов (📊 Логи)
- Просмотр всех решений системы доступа
- Автообновление каждые 3 секунды
- Отображение времени, действия и результата

## 🧪 Пример использования

### Тест через API

```bash
curl -X POST http://localhost:5000/auth \
  -H "Content-Type: application/json" \
  -d '{
    "user_role": "manager",
    "user_department": "sales",
    "action": "read",
    "document_id": 1
  }'
```

Ответ:
```json
{
  "allowed": true,
  "reason": "Access granted",
  "document": {
    "id": 1,
    "title": "Sales Report Q1",
    "department": "sales",
    "status": "approved",
    "sensitivity": "confidential"
  }
}
```

## 🗄️ База данных и политики колонок

### Таблица users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    role VARCHAR(50),
    department VARCHAR(50),
    attributes JSONB
);
```

### Таблица documents
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    department VARCHAR(50),
    status VARCHAR(20),
    sensitivity VARCHAR(20)
);
```

### Таблица access_logs
### Таблица column_policies (доступ к колонкам)
```sql
CREATE TABLE column_policies (
    id SERIAL PRIMARY KEY,
    resource VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    columns TEXT[] NOT NULL
);
```

Политики читаются приложением при запуске и используются для фильтрации полей в ответах `/users` и `/documents`.
```sql
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(50),
    resource VARCHAR(50),
    decision BOOLEAN,
    timestamp TIMESTAMP DEFAULT now()
);
```

## ⚙️ Политики Casbin

Файл `backend/casbin_policy.csv` содержит правила доступа:

```csv
p,admin,*,*                          # Админ имеет доступ ко всему
p,manager,sales,read                 # Менеджер может читать sales
p,manager,sales,draft,read           # Менеджер может читать черновики sales
p,employee,sales,approved,read       # Сотрудник может читать одобренные sales
p,viewer,sales,approved,read         # Зритель может читать одобренные sales
p,manager,engineering,read           # Менеджер может читать engineering
p,employee,engineering,draft,read   # Сотрудник может читать черновики engineering
```

## 🛠️ Разработка

### Запуск без Docker

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Логи
```bash
# Просмотр всех логов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f backend
docker compose logs -f postgres
docker compose logs -f frontend
```

### Остановка
```bash
docker compose down

# С удалением данных
docker compose down -v
```

## 📊 Примеры тестирования

### Сценарий 1: Менеджер читает одобренный документ sales
- Роль: manager
- Департамент: sales
- Документ: 1 (Sales Report Q1, status=approved)
- Результат: ✅ Разрешено

### Сценарий 2: Сотрудник пытается редактировать одобренный документ
- Роль: employee
- Департамент: sales
- Документ: 1 (status=approved)
- Результат: ❌ Запрещено

### Сценарий 3: Админ получает доступ ко всему
- Роль: admin
- Документ: любой
- Результат: ✅ Разрешено

## 🔧 Настройка

### Изменение портов

Отредактируйте `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8080:5000"  # Backend на порту 8080
  
  frontend:
    ports:
      - "8081:80"    # Frontend на порту 8081
```

### Изменение базы данных

Отредактируйте переменные окружения в `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: abac
  POSTGRES_PASSWORD: secret
  POSTGRES_DB: abac_db
```

## 📝 API Endpoints

### Авторизация и доступ
- `POST /auth` - Проверка доступа

### Пользователи
- `GET /users` - Получить всех пользователей
- `POST /users` - Создать пользователя
- `PUT /users/{id}` - Обновить пользователя
- `DELETE /users/{id}` - Удалить пользователя

### Документы
- `GET /documents` - Получить все документы
- `POST /documents` - Создать документ
- `PUT /documents/{id}` - Обновить документ

### Политики
- `GET /policies` - Получить все политики
- `POST /policies` - Добавить политику
- `DELETE /policies` - Удалить политику

### Политики по колонкам
- `GET /column-policies` - Получить политики колонок
- `POST /column-policies` - Добавить/обновить политику колонок
- `DELETE /column-policies?resource=...&role=...` - Удалить политику колонок

### Веб-ресурсы
- `POST /auth/web` - Проверка доступа к веб-ресурсам (например, GitHub)

## 🚦 Тестирование ABAC (скрипт)

```bash
./scripts/test_abac.sh
```
Скрипт проверит:
- `/auth/web` доступ к GitHub для admin
- `/auth` доступ менеджера к документу 1
- `/documents` с видимостью полей для роли viewer

### Логи
- `GET /logs` - Получить логи доступа

Полная документация API: http://localhost:5000/docs

Дополнительно: см. `docs/ABAC_USAGE.md` для подробного руководства по ABAC и примерам.

## 🤝 Вклад в проект

Приветствуются любые улучшения и предложения!

## 📄 Лицензия

MIT License

## 👤 Автор

Разработано для демонстрации работы ABAC системы

---

**Вопросы?** Откройте issue или свяжитесь с автором.

