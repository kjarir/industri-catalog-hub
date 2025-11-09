// EmailJS Configuration
// Get these values from: https://dashboard.emailjs.com/

export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u54dwa9',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_xs15xpo',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '5UcqtENo91frQVrc7',
};

// Validate configuration
export const isEmailjsConfigured = () => {
  return !!(emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey);
};

