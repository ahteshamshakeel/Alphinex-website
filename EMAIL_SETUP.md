# Email Configuration Guide

## Overview
The contact form on your website sends emails to addresses configured in the admin panel under "Contact Emails".

## Setup Instructions

### 1. Configure SMTP Settings

Update the following variables in your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Alphinex Solutions <your-email@gmail.com>"
```

### 2. Gmail Setup (Recommended)

If using Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. Use this App Password in `SMTP_PASS` (not your regular Gmail password)

### 3. Other Email Providers

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

#### Mailgun
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-mailgun-username"
SMTP_PASS="your-mailgun-password"
```

#### AWS SES
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-ses-smtp-username"
SMTP_PASS="your-ses-smtp-password"
```

### 4. Manage Contact Emails

1. Log in to the admin panel: `/admin/login`
2. Navigate to "Contact Emails" in the sidebar
3. Add/Edit/Delete email addresses that should receive contact form submissions
4. Toggle "Active" status to enable/disable specific emails
5. Set display order to prioritize certain emails

### 5. Testing

1. Configure at least one active contact email in the admin panel
2. Fill out the contact form on your website
3. Check if the email arrives at the configured addresses
4. If emails don't arrive, check:
   - SMTP credentials are correct
   - Firewall/antivirus isn't blocking port 587
   - Email provider allows SMTP access
   - Check server logs for error messages

## Features

- **Multiple Recipients**: Send contact form submissions to multiple email addresses
- **Dynamic Management**: Add/remove email addresses without code changes
- **Active/Inactive Toggle**: Temporarily disable emails without deleting them
- **Priority Ordering**: Control the order of recipients
- **Professional Templates**: Emails are formatted with your brand colors
- **Reply-To Support**: Recipients can reply directly to the contact form sender

## Troubleshooting

### Emails not sending
- Verify SMTP credentials in `.env`
- Check that at least one contact email is marked as "Active"
- Review server logs for error messages
- Test SMTP connection using a tool like Telnet

### Gmail "Less secure app" error
- Use App Password instead of regular password
- Enable 2-Factor Authentication first

### Port 587 blocked
- Try port 465 with `SMTP_SECURE="true"`
- Check firewall settings
- Contact your hosting provider

## Security Notes

- Never commit `.env` file to version control
- Use App Passwords, not regular passwords
- Regularly rotate SMTP credentials
- Monitor email sending logs for suspicious activity
- Consider rate limiting for production environments

## Default Contact Emails

The system is seeded with these default emails:
- alphinexsolutions@gmail.com
- suleman@alphinex.com
- nouman@alphinex.com

You can modify these in the admin panel.
