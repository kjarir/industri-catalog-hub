# EmailJS Setup Guide

## What You Have ✅
- **Service ID**: `service_u54dwa9`

## What You Need 🔧

### 1. Template ID
You need to create an email template in your EmailJS dashboard.

**Steps:**
1. Go to https://dashboard.emailjs.com/
2. Click on **"Email Templates"** in the left sidebar
3. Click **"Create New Template"**
4. Choose a template or start from scratch
5. In the template, use these variables (they match the form fields):
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Sender's phone number
   - `{{company}}` - Sender's company
   - `{{message}}` - Message content
   - `{{to_email}}` - Your receiving email (flowravalves@gmail.com)

**Example Template:**
```
Subject: New Contact Form Submission from {{from_name}}

From: {{from_name}} ({{from_email}})
Phone: {{phone}}
Company: {{company}}

Message:
{{message}}

---
This email was sent from the Flowra Valves contact form.
```

6. Click **"Save"**
7. Copy the **Template ID** (it will look like: `template_xxxxxxx`)

### 2. Public Key
Get your Public Key from EmailJS dashboard.

**Steps:**
1. Go to https://dashboard.emailjs.com/
2. Click on **"Account"** in the left sidebar
3. Go to **"API Keys"** tab
4. Copy your **Public Key** (it will look like: `xxxxxxxxxxxxx`)

## Configuration

### Option 1: Using Environment Variables (Recommended)

1. Create a `.env` file in the root of your project:
```bash
VITE_EMAILJS_SERVICE_ID=service_u54dwa9
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

2. Replace `your_template_id_here` and `your_public_key_here` with your actual values

3. Restart your development server after creating/updating the `.env` file

### Option 2: Direct Configuration

If you prefer not to use environment variables, you can directly edit:
`src/lib/emailjs.config.ts`

```typescript
export const emailjsConfig = {
  serviceId: 'service_u54dwa9',
  templateId: 'your_template_id_here',  // Replace with your Template ID
  publicKey: 'your_public_key_here',    // Replace with your Public Key
};
```

## Testing

1. Fill out the contact form on your website
2. Submit the form
3. Check your email (flowravalves@gmail.com) for the message
4. You should also see a success toast notification

## Troubleshooting

### Error: "EmailJS is not configured"
- Make sure you've set the Template ID and Public Key
- Check that your `.env` file is in the root directory
- Restart your development server after creating/updating `.env`

### Error: "Failed to send message"
- Verify your Template ID is correct
- Verify your Public Key is correct
- Check that your EmailJS service is active
- Make sure the template variables match the form fields

### Email not received
- Check your spam folder
- Verify the `to_email` in the template matches your receiving email
- Check EmailJS dashboard for any error logs

## Security Note

⚠️ **Important**: The Public Key is safe to use in frontend code. However, make sure:
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- The Public Key is different from the Private Key (which should NEVER be exposed)

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com/

