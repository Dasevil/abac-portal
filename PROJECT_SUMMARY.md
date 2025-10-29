# 📋 Сводка проекта ABAC Portal

## ✅ Что создано

### 🏗️ Полная структура проекта

```
ABAC/
├── backend/                      # FastAPI Backend
│   ├── main.py                   # Основной сервер с API endpoints
│   ├── casbin_model.conf         # Модель Casbin для ABAC
│   ├── casbin_policy.csv         # Политики доступа (правила)
│   ├── init_db.sql               # SQL схема и начальные данные
│   ├── requirements.txt          # Python зависимости
│   ├── Dockerfile                # Docker конфигурация для бэкенда
│   └── .dockerignore             # Игнорируемые файлы для Docker
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── App.js                # Главный компонент приложения
│   │   ├── api.js                # Axios конфигурация
│   │   ├── index.js              # Точка входа
│   │   └── components/
│   │       ├── AccessTester.js   # Компонент тестирования доступа
│   │       ├── UsersTable.js    # Управление пользователями
│   │       ├── DocumentsTable.js # Управление документами
│   │       ├── PoliciesTable.js  # Управление политиками
│   │       └── LogsViewer.js    # Просмотр логов
│   ├── public/
│   │   └── index.html            # HTML шаблон
│   ├── package.json              # NPM зависимости
│   ├── Dockerfile                # Docker конфигурация для фронтенда
│   └── .dockerignore             # Игнорируемые файлы
│
├── docker-compose.yml             # Docker Compose конфигурация
├── README.md                      # Полная документация
├── QUICKSTART.md                  # Быстрый старт
├── start.sh                       # Скрипт запуска для Linux/Mac
├── start.bat                      # Скрипт запуска для Windows
├── .gitignore                     # Игнорируемые файлы Git
└── .dockerignore                  # Игнорируемые файлы Docker
```

## 🎯 Функциональность

### Backend API (FastAPI)
- ✅ `/auth` - Проверка доступа на основе ABAC
- ✅ `/users` - CRUD операции для пользователей
- ✅ `/docs` - CRUD операции для документов
- ✅ `/policies` - Управление Casbin политиками
- ✅ `/logs` - Просмотр логов доступа
- ✅ CORS настроен для работы с фронтендом
- ✅ Автоматическое логирование решений

### Frontend UI (React)
- ✅ 🔑 Тест ABAC - Интерактивное тестирование доступа
- ✅ 🧑 Пользователи - Управление пользователями
- ✅ 📄 Документы - Управление документами
- ✅ ⚙️ Политики - Динамическое управление Casbin политиками
- ✅ 📊 Логи - Автообновляемый просмотр логов

### Database (PostgreSQL)
- ✅ Таблица `users` - Хранение пользователей и их атрибутов
- ✅ Таблица `documents` - Хранение документов
- ✅ Таблица `access_logs` - Логи всех решений доступа
- ✅ Начальные данные для тестирования

### Casbin Integration
- ✅ Модель ABAC в `casbin_model.conf`
- ✅ Политики доступа в `casbin_policy.csv`
- ✅ Динамическое добавление/удаление правил
- ✅ Сохранение изменений в файл

## 🚀 Как запустить

### Вариант 1: Автоматический (рекомендуется)
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

### Вариант 2: Вручную
```bash
docker compose up --build
```

### Результат
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/docs
- PostgreSQL: localhost:5432

## 🧪 Примеры использования

### 1. Тест доступа через UI
1. Откройте http://localhost:3000
2. Вкладка "🔑 Тест ABAC"
3. Выберите параметры и нажмите "Проверить доступ"

### 2. Тест через API
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

### 3. Сценарии тестирования

#### ✅ Разрешенный доступ
- Роль: `admin` → Любой документ → Всегда разрешено
- Роль: `manager`, Департамент: `sales` → `read` → Разрешено
- Роль: `employee`, Департамент: `sales`, Статус: `approved` → `read` → Разрешено

#### ❌ Запрещенный доступ
- Роль: `employee` → `write` на `approved` → Запрещено
- Роль: `viewer` → `read` на `draft` → Запрещено

## 📊 Технологии

- **Backend**: FastAPI, Casbin, PostgreSQL, psycopg2
- **Frontend**: React, Axios
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Access Control**: ABAC (Attribute-Based Access Control)

## 📝 Дополнительные возможности

1. **Управление политиками в реальном времени** - изменение правил через UI
2. **Автообновление логов** - каждые 3 секунды
3. **Полная интеграция Casbin** - все решения через модель ABAC
4. **CRUD для всех сущностей** - пользователи, документы, политики
5. **Логирование всех решений** - полная история доступа

## 🎨 Интерфейс

- Современный и интуитивный UI
- 5 основных вкладок для разных функций
- Цветовая индикация результатов
- Адаптивный дизайн

## 🔧 Настройка

Все настройки в `docker-compose.yml`:
- Порты: 3000 (frontend), 5000 (backend), 5432 (postgres)
- База данных: abac/secret/abac_db
- Автоматическая инициализация БД через init_db.sql

## 📚 Документация

- `README.md` - Полная документация проекта
- `QUICKSTART.md` - Быстрый старт
- `backend/main.py` - Код с подробными комментариями
- API Docs доступны на http://localhost:5000/docs

## ✅ Готово к использованию!

Проект полностью готов к запуску и тестированию ABAC системы.

