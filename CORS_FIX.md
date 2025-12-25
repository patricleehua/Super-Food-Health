# CORS Issue Fix

## Problem

Cross-Origin Resource Sharing (CORS) errors when frontend tries to communicate with backend.

## Solution

Use Next.js reverse proxy instead of direct API calls to avoid CORS issues in development.

## Configuration Changes

### 1. Frontend Configuration (web/.env.local)

```env
# Use Next.js proxy path instead of direct backend URL
NEXT_PUBLIC_API_URL=/api/v1
```

**How it works:**

- Frontend makes requests to `/api/v1/*` (same origin)
- Next.js proxy forwards to `http://localhost:8000/api/v1/*`
- No CORS issues because browser sees same-origin requests

### 2. Next.js Proxy (web/next.config.ts)

Already configured with rewrites:

```typescript
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
  ];
}
```

### 3. Backend CORS (api/app/main.py)

Updated to allow Next.js dev server origin:

```python
allowed_origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://localhost:3001",  # Alternative port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
```

## Steps to Fix

### 1. Stop Both Servers

```bash
# Stop Next.js dev server (Ctrl+C)
# Stop FastAPI server (Ctrl+C)
```

### 2. Update Frontend Environment

```bash
cd web

# Create or update .env.local
echo "NEXT_PUBLIC_API_URL=/api/v1" > .env.local
```

### 3. Restart Servers

**Terminal 1 - Backend:**

```bash
cd api
uv run uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**

```bash
cd web
npm run dev
```

### 4. Verify Configuration

Open browser console and check network requests:

- API calls should go to `/api/v1/...` (not `http://localhost:8000/...`)
- Status should be 200 (not CORS error)

## Request Flow

```
Browser Request:
  → http://localhost:3000/api/v1/auth/login

Next.js Proxy:
  → http://localhost:8000/api/v1/auth/login

FastAPI Response:
  ← Returns JSON response

Browser Receives:
  ← No CORS error (same origin)
```

## Troubleshooting

### Issue: Still getting CORS errors

**Solution:**

1. Clear browser cache
2. Restart both servers
3. Check `.env.local` file exists and has correct value
4. Verify Next.js is running on port 3000

### Issue: 404 on API calls

**Solution:**

1. Ensure backend is running on port 8000
2. Check Next.js proxy configuration in `next.config.ts`
3. Verify API endpoint paths are correct

### Issue: Authentication not working

**Solution:**

1. Check that Redis is running
2. Verify tokens are being sent in Authorization header
3. Check browser console for any errors

## Production Configuration

For production deployment, update:

**Frontend (.env.production):**

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

**Backend CORS:**

```python
allowed_origins = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

## Additional Notes

- **Development:** Uses Next.js proxy (no CORS)
- **Production:** Requires proper CORS configuration
- **Security:** Always use HTTPS in production
- **Credentials:** `allow_credentials=True` required for cookies/auth headers
