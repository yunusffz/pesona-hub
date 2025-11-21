# Docker Deployment Guide - Frontend

This directory contains Docker Compose configurations for frontend deployment in both development and production environments.

## Directory Structure

```
docker/
├── docker-compose.dev.yml    # Development environment
├── docker-compose.prod.yml   # Production environment
├── .env.dev.example          # Development environment variables template
├── .env.prod.example         # Production environment variables template
└── README.md                 # This file
```

## Quick Start

### Development Environment

1. Copy the example environment file:

   ```bash
   cp .env.dev.example .env
   ```

2. Edit `.env` and fill in your configuration values

3. Start the services:

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. Check service status:

   ```bash
   docker compose -f docker-compose.dev.yml ps
   ```

5. View logs:
   ```bash
   docker compose -f docker-compose.dev.yml logs -f api
   ```

### Production Environment

1. Copy the example environment file:

   ```bash
   cp .env.prod.example .env
   ```

2. Edit `.env` with strong, unique passwords

3. Start the services:

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

4. Check service status:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

## Services

### Development

- **Frontend**: Port 3000

### Production

- **Frontend**: Port 80

## Network Configuration

Both environments use isolated Docker networks:

- Development: `pesona-hub-digi-network-dev`
- Production: `pesona-hub-digi-network-prod`

This allows both environments to run simultaneously on the same server without conflicts.

## CI/CD Integration

### GitHub Actions Workflows

#### Development Deployment

- **Trigger**: Push to `dev` branch
- **Workflow**: `.github/workflows/deploy-dev.yml`
- **Target**: Development server

#### Production Deployment

- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/deploy-prod.yml`
- **Target**: Production server
- **Features**:
  - Automatic database backup before deployment
  - Zero-downtime rolling updates
  - Health checks before completion

### Required GitHub Secrets

#### Development Secrets

- `DEV_SERVER_HOST` - Development server hostname/IP
- `DEV_SERVER_USER` - SSH username
- `DEV_SERVER_SSH_KEY` - SSH private key (leave empty if using password)
- `DEV_SERVER_PASSWORD` - SSH password (leave empty if using SSH key)
- `DEV_SERVER_PORT` - SSH port (default: 22)
- `DEV_PESONA_API_URL` - Backend API URL (e.g., http://localhost:8000)
- `DEV_PESONA_APP_NAME` - Application name (e.g., Pesona Hub Dev)

**Note:** You can use either SSH key OR password for authentication. If using password, leave `DEV_SERVER_SSH_KEY` empty.

#### Production Secrets

- `PROD_SERVER_HOST` - Production server hostname/IP
- `PROD_SERVER_USER` - SSH username
- `PROD_SERVER_SSH_KEY` - SSH private key (leave empty if using password)
- `PROD_SERVER_PASSWORD` - SSH password (leave empty if using SSH key)
- `PROD_SERVER_PORT` - SSH port (default: 22)
- `PROD_PESONA_API_URL` - Backend API URL (e.g., https://api.yourdomain.com)
- `PROD_PESONA_APP_NAME` - Application name (e.g., Pesona Hub)

**Note:** You can use either SSH key OR password for authentication. If using password, leave `PROD_SERVER_SSH_KEY` empty.

## Common Commands

### View logs

```bash
# Development
docker compose -f docker-compose.dev.yml logs -f [service_name]

# Production
docker compose -f docker-compose.prod.yml logs -f [service_name]
```

### Restart services

```bash
# Development
docker compose -f docker-compose.dev.yml restart [service_name]

# Production
docker compose -f docker-compose.prod.yml restart [service_name]
```

### Stop services

```bash
# Development
docker compose -f docker-compose.dev.yml down

# Production
docker compose -f docker-compose.prod.yml down
```

### Update images

```bash
# Development
docker compose -f docker-compose.dev.yml pull
docker compose -f docker-compose.dev.yml up -d

# Production
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Health Checks

Frontend service includes health checks:

- **Frontend**: HTTP check using `wget` on port 80

## Resource Limits

Production environment includes resource limits:

- **Frontend**: 1 CPU core, 512MB RAM (limits), 0.5 CPU core, 256MB RAM (reservations)

## Troubleshooting

### Services not starting

1. Check logs: `docker compose -f docker-compose.[env].yml logs`
2. Verify environment variables in `.env`
3. Ensure ports are not in use: `netstat -tuln | grep [port]`

### Frontend not loading

1. Check if container is running: `docker compose -f docker-compose.[env].yml ps`
2. Verify environment variables in `.env`
3. Check frontend logs: `docker compose -f docker-compose.[env].yml logs frontend`
4. Test accessibility: `curl http://localhost:3000` (dev) or `curl http://localhost:80` (prod)

### API connection issues

1. Verify `PESONA_API_URL` is correctly set in `.env`
2. Check if backend service is accessible from frontend container
3. Check browser console for CORS errors

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Regularly update** Docker images
3. **Monitor logs** for suspicious activity
4. **Use HTTPS** in production with reverse proxy (nginx/traefik/cloudflare)
5. **Limit exposed ports** to only necessary services
6. **Keep secrets** in GitHub Secrets, not in code
7. **Set proper CORS** configuration in backend API
8. **Validate environment variables** before deployment

## Support

For issues or questions:

1. Check service logs
2. Review this documentation
3. Contact the development team
