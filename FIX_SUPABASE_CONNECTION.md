# Fix Supabase Connection Issues

## The Problem
Supabase has IPv4 compatibility issues with direct connections from some networks.

## Solutions (Try in Order)

### Solution 1: Use Transaction Pooler (RECOMMENDED)

1. In Supabase dashboard, click "Pooler settings"
2. Copy the **Transaction** mode connection string
3. It should look like:
   ```
   postgresql://postgres.utcrulmuqngwcdfdczzw:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

4. Update your .env:
   ```env
   DATABASE_URL="postgresql://postgres.utcrulmuqngwcdfdczzw:Noum@n27112222@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

5. Run:
   ```bash
   npx prisma db push
   ```

### Solution 2: Use Direct Connection with SSL

If pooler doesn't work, try direct connection with SSL:

```env
DATABASE_URL="postgresql://postgres:Noum@n27112222@db.utcrulmuqngwcdfdczzw.supabase.co:5432/postgres?sslmode=require"
```

### Solution 3: Enable IPv6 on Your Network

The error suggests IPv4 compatibility issues. Try:

1. **On Windows:**
   - Open Command Prompt as Administrator
   - Run: `netsh interface ipv6 set privacy state=disabled`
   - Restart your computer

2. **Check if IPv6 is enabled:**
   ```bash
   ping -6 db.utcrulmuqngwcdfdczzw.supabase.co
   ```

### Solution 4: Use Supabase CLI (Alternative)

If direct connection keeps failing:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref utcrulmuqngwcdfdczzw
   ```

3. Use local development:
   ```bash
   supabase start
   ```

4. Update .env to use local:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
   ```

### Solution 5: Use VPN or Different Network

Sometimes network/firewall blocks Supabase:
- Try using a VPN
- Try from a different network (mobile hotspot)
- Check if your firewall is blocking port 5432 or 6543

### Solution 6: Check Supabase Project Status

1. Go to: https://supabase.com/dashboard/project/utcrulmuqngwcdfdczzw
2. Check if project is "Active" (green status)
3. Check if there are any service disruptions
4. Try pausing and resuming the project

## Testing Connection

After updating .env, test with:

```bash
# Test connection
npx prisma db pull

# If successful, push schema
npx prisma db push

# Then seed data
npx tsx scripts/seed.ts
```

## Common Errors and Fixes

### "Can't reach database server"
- ✅ Use pooler connection
- ✅ Add `?sslmode=require`
- ✅ Check network/firewall
- ✅ Try VPN

### "Password authentication failed"
- ✅ Reset password in Supabase
- ✅ Check for special characters (escape them)
- ✅ Remove extra spaces

### "Connection timeout"
- ✅ Check internet connection
- ✅ Try different network
- ✅ Use pooler instead of direct

### "SSL required"
- ✅ Add `?sslmode=require` to connection string

## Still Not Working?

1. **Get the exact connection string from Supabase:**
   - Go to Project Settings → Database
   - Copy the EXACT string shown
   - Don't modify it

2. **Check Supabase Status:**
   - Visit: https://status.supabase.com
   - Check for any ongoing issues

3. **Contact Supabase Support:**
   - They can check if there's an issue with your project
   - They can verify your connection settings

## Working Configuration Example

```env
# Use this format (replace with your actual values)
DATABASE_URL="postgresql://postgres.utcrulmuqngwcdfdczzw:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

## Next Steps After Connection Works

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema
npx prisma db push

# 3. Seed data
npx tsx scripts/seed.ts

# 4. Start dev server
npm run dev
```
