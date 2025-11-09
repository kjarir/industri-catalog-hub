# EmailJS Credentials

## ✅ Configured Credentials

- **Service ID**: `service_u54dwa9`
- **Template ID**: `template_xs15xpo`
- **Public Key**: `5UcqtENo91frQVrc7`

## ⚠️ Security Warning

**PRIVATE KEY**: `Toacpxc3iVC8a2xDa-NHL`

**IMPORTANT**: 
- The Private Key should **NEVER** be used in frontend/client-side code
- The Private Key should **ONLY** be used for server-side operations
- The Private Key is **NOT** needed for the contact form (only Public Key is required)
- **DO NOT** commit the Private Key to version control
- **DO NOT** expose the Private Key in any public repository

## Current Setup

The contact form is configured to use:
- Public Key (safe for frontend use) ✅
- Service ID ✅
- Template ID ✅

The Private Key is stored here for reference but should only be used if you need server-side email functionality in the future.

## Testing

1. Go to your website's Contact page
2. Fill out the contact form
3. Submit the form
4. Check `arifshaikh@gmail.com` for the email
5. You should receive an email with the form submission details

## Template Variables

Make sure your EmailJS template (`template_xs15xpo`) includes these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{phone}}` - Phone number
- `{{company}}` - Company name
- `{{message}}` - Message content
- `{{to_email}}` - Receiving email (arifshaikh@gmail.com)

## If You Need to Change Credentials

Update the values in `src/lib/emailjs.config.ts` or use environment variables in `.env` file:

```bash
VITE_EMAILJS_SERVICE_ID=service_u54dwa9
VITE_EMAILJS_TEMPLATE_ID=template_xs15xpo
VITE_EMAILJS_PUBLIC_KEY=5UcqtENo91frQVrc7
```

