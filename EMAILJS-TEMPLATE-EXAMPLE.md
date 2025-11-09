# EmailJS Template Configuration - Exact Setup

## Copy This Template to Your EmailJS Dashboard

### Step 1: Go to Email Templates
1. Visit: https://dashboard.emailjs.com/admin/integration
2. Click on **"Email Templates"** in the left sidebar
3. Find template: `template_xs15xpo`
4. Click **"Edit"**

### Step 2: Configure Template Settings

**Template Name:** Contact Form - Flowra Valves

**Service:** `service_u54dwa9` (make sure this is selected)

**To Email:** `arifshaikh@gmail.com` (or leave blank if using template variable)

**From Name:** Flowra Valves Contact Form

**From Email:** (your EmailJS service email - should be auto-filled)

**Reply To:** `{{reply_to}}` (this will use the sender's email)

### Step 3: Template Content

**Subject Line:**
```
New Contact Form Submission from {{user_name}}
```

**Content (HTML or Plain Text):**
```
<h2>New Contact Form Submission</h2>

<p><strong>Name:</strong> {{user_name}}</p>
<p><strong>Email:</strong> {{user_email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Company:</strong> {{company}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><em>This email was sent from the Flowra Valves contact form.</em></p>
<p><strong>Reply to:</strong> {{reply_to}}</p>
```

**OR Plain Text Version:**
```
New Contact Form Submission

Name: {{user_name}}
Email: {{user_email}}
Phone: {{phone}}
Company: {{company}}

Message:
{{message}}

---
This email was sent from the Flowra Valves contact form.
Reply to: {{reply_to}}
```

### Step 4: Save Template

1. Click **"Save"** button
2. Make sure the template is **Active** (not disabled)
3. Verify the template is connected to service `service_u54dwa9`

### Step 5: Test

1. Go to your website's Contact page
2. Fill out the form
3. Submit
4. Check `arifshaikh@gmail.com` for the email

## Alternative: If Your Template Uses Different Variable Names

If your template already has different variable names, tell me what they are and I'll update the code to match. Common variations:

- `{{name}}` instead of `{{user_name}}`
- `{{sender_name}}` instead of `{{user_name}}`
- `{{email}}` instead of `{{user_email}}`
- `{{sender_email}}` instead of `{{user_email}}`
- `{{msg}}` instead of `{{message}}`
- `{{text}}` instead of `{{message}}`

## Quick Check

After saving your template, verify:
- ✅ Template is active
- ✅ Template is connected to service `service_u54dwa9`
- ✅ To Email is set to `arifshaikh@gmail.com` (or uses `{{to_email}}` variable)
- ✅ All variables in template match: `user_name`, `user_email`, `phone`, `company`, `message`, `reply_to`

