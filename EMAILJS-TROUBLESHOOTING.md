# EmailJS 422 Error - Troubleshooting Guide

## The Problem
You're getting a **422 error** which means: "Template configuration error" - the template variables don't match what we're sending.

## Quick Fix Steps

### Step 1: Check Your EmailJS Template Variables

1. Go to https://dashboard.emailjs.com/
2. Click on **"Email Templates"**
3. Find your template: `template_xs15xpo`
4. Click to edit it
5. Look at what variables are used in the template (they look like `{{variable_name}}`)

### Step 2: Match the Variables

The code is now sending these variables (with multiple name variations):
- `user_name`, `from_name`, `name` - Sender's name
- `user_email`, `from_email`, `email` - Sender's email
- `phone`, `phone_number` - Phone number
- `company`, `company_name` - Company name
- `message`, `user_message` - Message content
- `to_email` - Receiving email
- `reply_to` - Reply-to email

### Step 3: Update Your EmailJS Template

Your template should use **AT LEAST ONE** of these variable names for each field. Here's an example template:

**Subject:**
```
New Contact Form Submission from {{user_name}}
```
or
```
New Contact Form Submission from {{from_name}}
```

**Body:**
```
Name: {{user_name}}
Email: {{user_email}}
Phone: {{phone}}
Company: {{company}}
Message: {{message}}

---
This email was sent from the Flowra Valves contact form.
Reply to: {{reply_to}}
```

### Step 4: Common Variable Names

If your template uses different names, you have two options:

#### Option A: Update Your Template (Recommended)
Change your template to use one of these variable names:
- For name: `{{user_name}}` or `{{from_name}}` or `{{name}}`
- For email: `{{user_email}}` or `{{from_email}}` or `{{email}}`
- For phone: `{{phone}}` or `{{phone_number}}`
- For company: `{{company}}` or `{{company_name}}`
- For message: `{{message}}` or `{{user_message}}`

#### Option B: Update the Code
If your template uses specific variable names (like `{{sender_name}}` instead of `{{user_name}}`), we can update the code to match your template.

## Verify Your Template Settings

1. Make sure your template is **connected** to service `service_u54dwa9`
2. Check that the **To Email** field in your template is set correctly
3. Make sure the template is **active** (not disabled)

## Test Again

After updating your template:
1. Save the template in EmailJS dashboard
2. Go to your website's Contact page
3. Fill out and submit the form
4. Check the browser console for any errors
5. Check `arifshaikh@gmail.com` for the email

## Still Not Working?

If you're still getting errors, please:
1. Check the browser console for the full error message
2. Share what variable names your template is using
3. Verify your service is connected to the template
4. Check that your Public Key is correct: `5UcqtENo91frQVrc7`

## Alternative: Use sendForm Method

If the template approach doesn't work, we can switch to using the `sendForm` method which automatically maps form field names to template variables. Let me know if you want to try this approach.

