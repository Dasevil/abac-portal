# 🚀 Быстрый старт ABAC Portal

## 1. Установка и запуск

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Вручную
```bash
docker compose up --build
```

## 2. Откройте браузер

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:5000/docs

## 3. Тестирование

### Через UI

1. Откройте http://localhost:3000
2. Вкладка "🔑 Тест ABAC"
3. Выберите параметры и нажмите "Проверить доступ"

### Через API

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

## 4. Использование

### Вкладки интерфейса

- **🔑 Тест ABAC** - Тестирование доступа
- **🧑 Пользователи** - Управление пользователями
- **📄 Документы** - Управление документами
- **⚙️ Политики** - Управление Casbin политиками
- **📊 Логи** - Просмотр логов доступа

## 5. Остановка

```bash
docker compose down

# С удалением данных
docker compose down -v
```

## 6. Просмотр логов

```bash
# Все логи
docker compose logs -f

# Только backend
docker compose logs -f backend

# Только frontend
docker compose logs -f frontend

# Только база данных
docker compose logs -f postgres
```

## Примеры тестов

### ✅ Разрешенный доступ
- Роль: admin → Любой документ → ✅ Всегда разрешено
- Роль: manager, Департамент: sales → Документ sales/approved → ✅ read разрешено

### ❌ Запрещенный доступ
- Роль: employee → Документ approved → ❌ write запрещено
- Роль: viewer → Документ draft → ❌ read запрещено

## Troubleshooting

### Контейнеры не запускаются
```bash
docker compose down -v
docker compose up --build
```

### База данных не доступна
```bash
# Проверьте логи
docker compose logs postgres

# Перезапустите postgres
docker compose restart postgres
```

### Frontend не подключается к Backend
- Проверьте, что оба контейнера запущены: `docker compose ps`
- Проверьте логи: `docker compose logs backend frontend`

## Дополнительные возможности

### Добавление новых политик

1. Откройте вкладку "⚙️ Политики"
2. Нажмите "➕ Добавить политику"
3. Введите Subject, Object, Action
4. Нажмите "Сохранить"

### Создание нового пользователя

1. Откройте вкладку "🧑 Пользователи"
2. Нажмите "➕ Добавить пользователя"
3. Заполните форму
4. Нажмите "Сохранить"

### Создание нового документа

1. Откройте вкладку "📄 Документы"
2. Нажмите "➕ Добавить документ"
3. Заполните форму
4. Нажмите "Сохранить"

---

**Готово!** Теперь вы можете тестировать ABAC систему.

