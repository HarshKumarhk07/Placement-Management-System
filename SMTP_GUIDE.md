# SMTP Configuration Guide

The Placement Management System now supports automated email notifications for application status updates. To enable this in production, you must configure SMTP settings in your backend `.env` file.

## Required Environment Variables

Add the following to `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

## Setup Instructions (Gmail)

1. **Enable App Passwords**:
   - Go to your Google Account settings.
   - Search for "App Passwords".
   - Generate a new app password for "Mail".
   
2. **Security**:
   - Never use your primary account password.
   - Use a dedicated email account for notifications if possible.

## Testing (Development)

By default, the system uses **Ethereal Email** (a fake SMTP service) if variables are missing. You can view logs in the backend console to see the `messageId` of sent emails.

---
*Note: Status changes that trigger emails include: Shortlisted, Interview Scheduled, Selected, and Offer Released.*
