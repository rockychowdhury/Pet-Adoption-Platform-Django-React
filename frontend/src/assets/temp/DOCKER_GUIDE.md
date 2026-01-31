# Docker & Redis Cheat Sheet

This guide covers the essential commands for managing your Pet Adoption Platform in Docker.

## 🚀 Daily Operations

### Start Everything
Builds images (if needed) and starts all services (Backend, Frontend, DB, Redis, Celery).
```bash
docker compose up --build
```
*   `--build`: Recompiles code changes (important for React/Python updates).
*   `-d`: (Optional) Runs in "detached" mode (background). Use `docker compose logs -f` to see output.

### Stop Everything
Stops and removes containers (data in volumes is preserved).
```bash
docker compose down
```

### View Logs
See what's happening in specific services (e.g., if the backend is crashing or Celery is processing tasks).
```bash
# All logs
docker compose logs -f

# Specific service logs
docker compose logs -f backend
docker compose logs -f celery
docker compose logs -f frontend
```

---

## 🛠 Backend Management

### Access the Backend Shell
Run Django commands manually (like creating superusers).
```bash
docker compose exec backend sh
```
*Once inside:*
```bash
python manage.py createsuperuser
python manage.py makemigrations
python manage.py migrate
```

### One-off Commands (without entering shell)
```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 🧠 Redis (Queue & Cache)

### Check Redis Status
See if Redis is accepting connections.
```bash
docker compose exec redis redis-cli ping
# Output: PONG
```

### Monitor Real-time Tasks
Watch Celery tasks being pushed and popped from the queue.
```bash
docker compose exec redis redis-cli monitor
```

### Inspect Keys
See what data is stored (e.g., Celery task results).
```bash
docker compose exec redis redis-cli
```
*Inside Redis CLI:*
```redis
KEYS *           # List all keys (careful in production!)
GET [key_name]   # View value of a key
DBSIZE           # Number of keys
FLUSHALL         # Clear all data (Reset the queue)
```

---

## 🧹 Maintenance

### Clean Unused Docker Objects
Free up disk space by removing stopped containers, unused networks, and old images.
```bash
docker system prune
```
*Note: This won't delete your database data (volumes).*

### Reset Database (Hard Reset)
**WARNING: Deletes all your data!**
```bash
docker compose down -v
docker compose up --build
```
