# Google Login Troubleshooting Guide

This document helps troubleshoot common issues with Google Firebase Authentication.

## Common Issues and Solutions

### 1. "Dominio non autorizzato" (Unauthorized Domain)
**Cause**: The domain is not authorized in Firebase Console.

**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication > Settings > Authorized domains
4. Add your domain(s):
   - `localhost` (for development)
   - Your production domain
   - `127.0.0.1` (if testing locally)

### 2. "Il popup è stato bloccato dal browser" (Popup Blocked)
**Cause**: Browser popup blocker is preventing the Google OAuth popup.

**Solution**:
- The app automatically falls back to redirect method
- Users can disable popup blocker for your domain
- Consider using `signInWithRedirect` instead of `signInWithPopup`

### 3. "Login Google non abilitato" (Google Login Not Enabled)
**Cause**: Google sign-in provider is not enabled in Firebase.

**Solution**:
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Google provider
3. Configure OAuth consent screen in Google Cloud Console
4. Add authorized JavaScript origins and redirect URIs

### 4. OAuth Client Configuration Issues

**Required Setup in Google Cloud Console**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services > Credentials
3. Configure OAuth 2.0 Client ID:
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (Vite dev server)
     - `https://your-domain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/__/auth/handler` (development)
     - `https://your-domain.com/__/auth/handler` (production)

### 5. Environment Variables

Ensure these are set in your `.env.local` file (create it in `apps/estecla-universe/`):

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 6. Testing Google Login

1. **Development**: Use `http://localhost:5173` (not `127.0.0.1` or `0.0.0.0`)
2. **Production**: Use HTTPS (required for Google OAuth)
3. **Check browser console** for detailed error messages
4. **Network tab**: Look for failed requests to Google OAuth endpoints

### 7. Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/popup-blocked` | Browser blocked popup | Use redirect method or allow popups |
| `auth/popup-closed-by-user` | User closed popup | Normal, user cancelled |
| `auth/unauthorized-domain` | Domain not authorized | Add domain to Firebase Console |
| `auth/operation-not-allowed` | Provider disabled | Enable Google provider in Firebase |
| `auth/invalid-api-key` | Wrong API key | Check environment variables |
| `auth/network-request-failed` | Network issue | Check internet connection |

### 8. Debug Information

The app now includes detailed logging. Check the browser console for:
- Firebase configuration validation
- Google provider scope configuration
- Login attempt details
- Specific error messages in Italian

### 9. Firebase Console Checklist

- [ ] Google provider is enabled
- [ ] Authorized domains are configured
- [ ] OAuth client is properly configured in Google Cloud Console
- [ ] Environment variables are correctly set
- [ ] Project has billing enabled (if required for your usage)