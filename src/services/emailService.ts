import emailjs from '@emailjs/browser';

/**
 * A completely free, client-side email service using EmailJS.
 * No backend or credit card required.
 */
class EmailService {
  private serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  private templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  private publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  constructor() {
    if (this.publicKey) {
      emailjs.init(this.publicKey);
    }
  }

  /**
   * Send an email using EmailJS
   * @param toEmail The recipient's email address
   * @param subject The email subject line
   * @param extraParams Any additional variables the template needs
   */
  async sendEmail(toEmail: string, subject: string, extraParams: Record<string, any> = {}) {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      console.warn("EmailJS is not configured. Missing environment variables.");
      return false;
    }

    try {
      const templateParams = {
        to_email: toEmail,
        subject: subject,
        ...extraParams
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.publicKey
      );

      console.log('Email sent successfully!', response.status, response.text);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
