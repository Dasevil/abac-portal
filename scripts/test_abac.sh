#!/usr/bin/env bash
set -euo pipefail

API_URL=${API_URL:-http://localhost:5000}

echo "== Test: admin read github via /auth/web =="
curl -s -X POST "$API_URL/auth/web" \
  -H 'Content-Type: application/json' \
  -d '{"user_role":"admin","action":"read","service":"github"}' | jq . || true

echo "== Test: manager read document 1 via /auth =="
curl -s -X POST "$API_URL/auth" \
  -H 'Content-Type: application/json' \
  -d '{"user_role":"manager","user_department":"sales","action":"read","document_id":1}' | jq . || true

echo "== Test: viewer read documents listing with visibility filter =="
curl -s "$API_URL/documents" -H 'X-User-Role: viewer' | jq . || true


