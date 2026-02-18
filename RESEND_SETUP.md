# Resend Email Setup Guide

## Why Resend?

Resend is a modern email API that's:
- ✅ **Simple**: Just one API key, no SMTP configuration
- ✅ **Free**: 3,000 emails/month on free tier
- ✅ **Reliable**: 99.9% uptime guarantee
- ✅ **Fast**: Emails delivered in seconds
- ✅ **No Credit Card**: Free tier doesn't require payment info

## Quick Setup (5 minutes)

### Step 1: Create Resend Account

1. Go to [resend.com/signup](https://resend.com/signup)
2. Sign up with your email (GitHub/Google login available)
3. Verify your email address

### Step 2: Get API Key

1. Once logged in, go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Alphinex Contact Form")
4. Select "Sending access" permission
5. Click "Create"
6. **Copy the API key** (you won't see it again!)

### Step 3: Add to .env File

Open your `.env` file and add:

```env
RESEND_API_KEY="re_your_actual_api_key_here"
```

Replace `re_your_actual_api_key_here` with the key you copied.

### Step 4: Restart Server

Stop your development server (Ctrl+C) and start it again:

```bash
npm run dev
```

### Step 5: Test It!

1. Go to your admin panel: `/admin/contact-emails`
2. Click the "Test Email" button
3. If successful, you'll see a green success message
4. Check the Resend dashboard to see the sent email

## Using Your Own Domain (Optional)

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. Go to [Domains](https://resend.com/domains) in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `alphinex.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually 5-10 minutes)
6. Update the `from` address in `app/api/contact/route.ts`:

```typescript
from: 'Alphinex Solutions <contact@yourdomain.com>',
```

## Monitoring

View all sent emails in the [Resend Dashboard](https://resend.com/emails):
- See delivery status
- View email content
- Check bounce/spam reports
- Monitor usage

## Troubleshooting

### "API key not configured" error
- Make sure `RESEND_API_KEY` is in your `.env` file
- Restart your development server
- Check for typos in the key

### Emails not arriving
- Check Resend dashboard for delivery status
- Verify recipient email addresses are correct
- Check spam folder
- Ensure you haven't exceeded free tier limit (3,000/month)

### "Invalid API key" error
- Generate a new API key from Resend dashboard
- Make sure you copied the entire key
- Check for extra spaces in `.env` file

## Free Tier Limits

- **3,000 emails per month**
- **100 emails per day**
- **1 email per second**

For most contact forms, this is more than enough!

## Upgrade Options

If you need more:
- **Pro Plan**: $20/month for 50,000 emails
- **Business Plan**: Custom pricing for higher volumes

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Discord Community](https://resend.com/discord)
- [Email Support](mailto:support@resend.com)

## Security Notes

- Never commit `.env` file to version control
- Keep your API key secret
- Rotate keys regularly
- Use different keys for development and production
- Monitor usage in Resend dashboard

## Alternative: Keep Using SMTP

If you prefer SMTP (Gmail, SendGrid, etc.), see `EMAIL_SETUP.md` for configuration instructions.
