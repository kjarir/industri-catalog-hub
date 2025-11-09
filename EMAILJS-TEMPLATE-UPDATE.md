# Optional: Update Your EmailJS Template with Website URL

## Current Status ✅

Your contact form is now configured to send the exact variables your template needs:
- `{{from_name}}`
- `{{from_email}}`
- `{{phone}}`
- `{{company}}`
- `{{message}}`
- `{{to_email}}`

## Optional Enhancement: Add Website URL

I've added a `website_url` variable to the code. If you want to use it in your template to replace `[Website Link]`, you can:

### Option 1: Update Template to Use Variable (Recommended)

1. Go to EmailJS Dashboard: https://dashboard.emailjs.com/admin/integration
2. Edit template: `template_xs15xpo`
3. Replace `[Website Link]` with `{{website_url}}` in both places:
   - In the header logo link: `href="{{website_url}}"`
   - In the "Visit Flowra Valves" button: `href="{{website_url}}"`

### Option 2: Hardcode Your Website URL

If you prefer, you can simply replace `[Website Link]` with your actual website URL (e.g., `https://yourdomain.com`)

## Your Template Variables (Complete List)

The contact form now sends:
- `{{from_name}}` - Sender's name ✅
- `{{from_email}}` - Sender's email ✅
- `{{phone}}` - Phone number ✅
- `{{company}}` - Company name ✅
- `{{message}}` - Message content ✅
- `{{to_email}}` - Receiving email (flowravalves@gmail.com) ✅
- `{{reply_to}}` - Reply-to email (sender's email) ✅
- `{{website_url}}` - Website URL (optional) ✅

## Test It Now!

1. Go to your Contact page
2. Fill out and submit the form
3. Check `flowravalves@gmail.com`
4. You should receive a beautifully formatted email! 🎉

Everything is configured and ready to go! 🚀

