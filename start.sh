#!/bin/bash

echo "🚀 Запуск ABAC Portal..."
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker для продолжения."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose для продолжения."
    exit 1
fi

echo "✅ Docker найден"
echo ""

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker compose down

# Сборка и запуск
echo "🏗️ Сборка контейнеров..."
docker compose build

echo "🚀 Запуск всех сервисов..."
docker compose up -d

echo ""
echo "✅ ABAC Portal запущен!"
echo ""
echo "📊 Ссылки:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:5000"
echo "  API Docs:  http://localhost:5000/docs"
echo ""
echo "Логи можно просмотреть командой:"
echo "  docker compose logs -f"
echo ""
echo "Остановка:"
echo "  docker compose down"

