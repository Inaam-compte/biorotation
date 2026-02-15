# Authentication Toggle Feature

## Overview
This application supports toggling authentication on/off using an environment variable. **By default, authentication is DISABLED** for easier development and demo purposes.

## How to Enable/Disable Authentication

### Configuration

In your `.env` or `.env.local` file, set the `DISABLE_AUTH` variable:

```env
# Disable authentication (DEFAULT - bypass login)
DISABLE_AUTH=true
# OR simply don't set it at all - auth will be disabled by default

# OR

# Enable authentication (require login)
DISABLE_AUTH=false
```

### Default Behavior

⚠️ **Important**: If `DISABLE_AUTH` is not set, authentication is **DISABLED** by default.

To enable authentication, you must explicitly set:
```env
DISABLE_AUTH=false
```

### Behavior

#### When `DISABLE_AUTH` is not set or `DISABLE_AUTH=true` (Authentication Disabled - DEFAULT)
- **Landing Page**: Automatically redirects to dashboard
- **Protected Routes**: Accessible without authentication
- **User Flow**: Direct access to all features without login
- **Session Management**: Uses a mock demo user session
- **Mock User**: 
  - Name: "Utilisateur Demo"
  - Phone: "+216123456789"
  - Exploitant: "Ferme Demo"
  - Gouvernorat: "Tunis"

#### When `DISABLE_AUTH=false` (Authentication Enabled)
- **Landing Page**: Shows marketing content with sign-up/sign-in buttons
- **Protected Routes**: Require authentication to access (/dashboard, /rationing, etc.)
- **User Flow**: Users must sign up or sign in to access the application
- **Session Management**: Uses Better Auth for session management

## Implementation Details

### Modified Files

1. **`.env.example`**
   - Added `DISABLE_AUTH` variable documentation

2. **`middleware.ts`**
   - Checks `DISABLE_AUTH` environment variable
   - Bypasses authentication checks when disabled

3. **`app/page.tsx`**
   - Redirects to dashboard when auth is disabled

4. **`lib/auth-utils.ts`** (New)
   - Utility functions for auth state checking
   - Mock session generator
   - Session fallback helper

5. **`components/Sidebar.tsx`**
   - Uses mock session when auth is disabled
   - Changes logout button to "Retour à l'accueil" when auth is disabled

## Usage Examples

### Development/Demo Mode (No Auth - DEFAULT)
```env
# Authentication is disabled by default, no need to set anything
# Or explicitly set:
DISABLE_AUTH=true
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="dev-secret"
```

### Production Mode (With Auth)
```env
# Must explicitly enable authentication:
DISABLE_AUTH=false
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="production-secret-key"
```

## Security Considerations

⚠️ **Important**: Only use `DISABLE_AUTH=true` in:
- Development environments
- Demo deployments
- Internal testing
- Environments where data security is not a concern

❌ **Never use** `DISABLE_AUTH=true` in:
- Production environments with real user data
- Any environment accessible to the public
- Deployments handling sensitive information

## Testing

After changing the `DISABLE_AUTH` variable:

1. Restart your development server
```bash
npm run dev
```

2. Or rebuild for production
```bash
npm run build
npm start
```

3. Navigate to the root URL:
   - With auth disabled: Should redirect to `/dashboard`
   - With auth enabled: Should show landing page

## Troubleshooting

### Changes Not Taking Effect
- Make sure to restart the development server after changing `.env`
- For production builds, rebuild the application
- Clear browser cache and cookies

### Still Seeing Authentication
- Verify `DISABLE_AUTH=true` is exactly as shown (no quotes, no spaces)
- Check you're editing the correct `.env` file
- Ensure the environment variable is loaded (check with `console.log(process.env.DISABLE_AUTH)`)
