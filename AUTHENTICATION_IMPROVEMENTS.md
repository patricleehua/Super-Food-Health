# Authentication System Improvements

## Overview

This document outlines the comprehensive authentication and token management improvements implemented for the Super Food Health application.

## Problems Solved

### Backend Issues

1. ✅ **Login tokens not stored in Redis** - Tokens are now stored in Redis for session management
2. ✅ **No authentication middleware** - Implemented middleware with whitelist for public endpoints
3. ✅ **Missing token refresh logic** - Full token refresh implementation with automatic renewal
4. ✅ **No endpoint protection** - All endpoints now require authentication except whitelisted ones

### Frontend Issues

1. ✅ **No token caching** - Tokens now stored in localStorage with expiry tracking
2. ✅ **No token expiration handling** - Automatic token refresh before expiry
3. ✅ **No automatic token renewal** - API client automatically refreshes expired tokens
4. ✅ **Missing authentication context** - Global auth state management with React Context
5. ✅ **No protected routes** - Route protection component for authenticated pages

## Backend Changes

### 1. Configuration Updates (`api/app/core/config.py`)

**New Settings:**

```python
# Refresh token expiration
REFRESH_TOKEN_EXPIRE_DAYS: int = 30  # 30 days

# Public endpoints whitelist (no authentication required)
PUBLIC_ENDPOINTS: list[str] = [
    "/",
    "/health",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/wx/login",
    "/api/v1/auth/refresh",
]
```

### 2. Token Management (`api/app/api/v1/endpoints/auth.py`)

**New Features:**

**A. Store Tokens in Redis:**

```python
async def store_token_in_redis(redis, user_id, access_token, refresh_token):
    # Stores both access and refresh tokens
    # Creates token-to-user mapping for validation
    # Sets TTL based on token expiration
```

**B. Token Refresh Endpoint:**

```python
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, ...):
    # Validates refresh token from Redis
    # Generates new access and refresh tokens
    # Updates tokens in Redis
    # Returns new tokens to client
```

**C. Enhanced Login/Register:**

- Both endpoints now store tokens in Redis after generation
- Consistent token handling across all authentication flows

### 3. Authentication Middleware (`api/app/core/auth_middleware.py`)

**Features:**

- Validates JWT tokens for all requests except whitelisted endpoints
- Checks token blacklist in Redis
- Standardized error responses with error codes
- Adds user_id to request state for downstream use

**Error Codes:**

- `MISSING_AUTH_HEADER` - No Authorization header provided
- `INVALID_AUTH_FORMAT` - Invalid Bearer token format
- `TOKEN_REVOKED` - Token has been blacklisted
- `INVALID_TOKEN_PAYLOAD` - Invalid JWT payload
- `INVALID_TOKEN` - Token is expired or malformed

**Middleware Registration:**

```python
# In api/app/main.py
app.add_middleware(AuthenticationMiddleware)
```

## Frontend Changes

### 1. Token Manager (`web/src/lib/token-manager.ts`)

**Features:**

- Stores access and refresh tokens in localStorage
- Tracks token expiration time
- Decodes JWT tokens client-side
- Checks if token is expired (with 5-minute buffer)
- Provides user ID extraction

**Methods:**

```typescript
setTokens(accessToken, refreshToken); // Store tokens
getAccessToken(); // Get current access token
getRefreshToken(); // Get current refresh token
clearTokens(); // Clear all tokens
isTokenExpired(); // Check if token needs refresh
getUserId(); // Extract user ID from token
```

### 2. API Client (`web/src/lib/api.ts`)

**Features:**

- Automatic token refresh before requests
- Retry failed requests after token refresh
- Handles 401 errors with automatic re-authentication
- Centralized error handling
- Type-safe API methods

**Automatic Token Refresh Flow:**

```
1. Check if token is expired (within 5 minutes)
2. If expired, refresh token automatically
3. Retry original request with new token
4. If refresh fails, redirect to login
```

**API Methods:**

```typescript
authApi.login(email, password);
authApi.register(email, password);
authApi.logout();
authApi.refresh(refreshToken);

userApi.getProfile();
userApi.updateProfile(data);
```

### 3. Authentication Context (`web/src/contexts/auth-context.tsx`)

**Features:**

- Global authentication state management
- Automatic token validation on app load
- Automatic token refresh when expired
- Login/Register/Logout methods
- Loading states during auth operations

**Context Interface:**

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email, password) => Promise<void>;
  register: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}
```

**Usage:**

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### 4. Protected Route Component (`web/src/components/protected-route.tsx`)

**Features:**

- Wraps pages requiring authentication
- Automatic redirect to login if not authenticated
- Loading state while checking authentication
- Customizable redirect path

**Usage:**

```tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### 5. Layout Updates (`web/src/app/[locale]/layout.tsx`)

- Wrapped entire app with `AuthProvider`
- Global authentication state available to all components

## Setup Instructions

### Backend Setup

1. **Update Environment Variables:**

```bash
cd api
cp .env.example .env
# Edit .env and ensure these are set:
# SECRET_KEY=your-secret-key-change-in-production
# REDIS_URL=redis://localhost:6379/0
```

2. **Ensure Redis is Running:**

```bash
# Windows (with Redis installed)
redis-server

# Or using Docker
docker run -d -p 6379:6379 redis:alpine
```

3. **Start the API:**

```bash
cd api
uv run uvicorn app.main:app --reload
```

### Frontend Setup

1. **Create Environment File:**

```bash
cd web
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

2. **Install Dependencies (if needed):**

```bash
npm install
```

3. **Start Development Server:**

```bash
npm run dev
```

## Testing the Implementation

### 1. Test Login Flow

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response includes access_token and refresh_token
```

### 2. Test Protected Endpoint

```bash
# Without token (should fail)
curl http://localhost:8000/api/v1/me

# With token (should succeed)
curl http://localhost:8000/api/v1/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Test Token Refresh

```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"YOUR_REFRESH_TOKEN"}'
```

### 4. Test Logout

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Security Considerations

### Backend

1. **Token Storage**: Tokens stored in Redis with TTL matching token expiration
2. **Token Blacklist**: Revoked tokens added to blacklist until expiration
3. **Middleware Protection**: All endpoints protected except explicit whitelist
4. **Secret Key**: Use strong, unique secret key in production

### Frontend

1. **localStorage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Auto-refresh**: Tokens refreshed 5 minutes before expiration
3. **Error Handling**: Expired/invalid tokens trigger re-authentication
4. **HTTPS**: Always use HTTPS in production

## Token Lifecycle

### Access Token

- **Expiration**: 8 days (configurable in `settings.ACCESS_TOKEN_EXPIRE_MINUTES`)
- **Storage**: Redis + Frontend localStorage
- **Usage**: Every API request
- **Refresh**: Automatic when within 5 minutes of expiry

### Refresh Token

- **Expiration**: 30 days (configurable in `settings.REFRESH_TOKEN_EXPIRE_DAYS`)
- **Storage**: Redis + Frontend localStorage
- **Usage**: Only for refreshing access tokens
- **Rotation**: New refresh token issued with each refresh

## API Endpoints Summary

### Public Endpoints (No Auth Required)

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /docs` - API documentation
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/wx/login` - WeChat login
- `POST /api/v1/auth/refresh` - Token refresh

### Protected Endpoints (Auth Required)

- All other endpoints require valid JWT token in Authorization header

## Troubleshooting

### Backend Issues

**Problem**: Tokens not being stored in Redis
**Solution**: Ensure Redis is running and connection is configured correctly

**Problem**: Authentication middleware rejecting valid tokens
**Solution**: Check that token is in correct format: `Bearer <token>`

### Frontend Issues

**Problem**: Login redirects but user not authenticated
**Solution**: Check browser console for errors, verify API_URL is correct

**Problem**: Token refresh failing
**Solution**: Verify refresh token is stored correctly and hasn't expired

**Problem**: Protected routes not working
**Solution**: Ensure `AuthProvider` wraps your app in layout.tsx

## Future Enhancements

1. **Refresh Token Rotation**: Implement refresh token family for better security
2. **Session Management**: Add ability to view/revoke active sessions
3. **Multi-device Support**: Track and manage tokens across devices
4. **Token Introspection**: Add endpoint to validate token status
5. **Rate Limiting**: Add rate limiting to auth endpoints
6. **2FA Support**: Add two-factor authentication option
7. **httpOnly Cookies**: Move to httpOnly cookies for better XSS protection

## References

- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
