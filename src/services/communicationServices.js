// SMS Service Integration

class SMSService {
  constructor() {
    // In production, initialize with your SMS service credentials
    this.apiKey = process.env.REACT_APP_SMS_API_KEY || 'mock-api-key';
    this.serviceProvider = process.env.REACT_APP_SMS_PROVIDER || 'mock';
  }

  async sendSMS(phoneNumber, message) {
    console.log(`SMS Service: Sending message to ${phoneNumber}`);
    console.log(`Message: ${message}`);

    try {
      // Mock implementation replace with actual service
      if (this.serviceProvider === 'twilio') {
        return await this.sendViaTwilio(phoneNumber, message);
      } else if (this.serviceProvider === 'aws-sns') {
        return await this.sendViaAWSSNS(phoneNumber, message);
      } else {
        return await this.mockSend(phoneNumber, message);
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendViaTwilio(phoneNumber, message) {
    // Example Twilio integration
    const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.REACT_APP_TWILIO_FROM_NUMBER;

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: fromNumber,
        Body: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.sid,
      provider: 'twilio',
      timestamp: new Date().toISOString(),
    };
  }

  async sendviaAWSSNS(phoneNumber, message) {
    // Example AWS SNS integration
    // Note: This would require AWS SDK and proper auth
    console.log('Sending via AWS SNS...');

    return {
      success: true,
      messageId: `aws-sns-${Date.now()}`,
      provider: 'aws-sns',
      timestamp: new Date().toISOString(),
    };
  }

  async mockSend(phoneNumber, message) {
    console.log('MOCK SMS SERVICE MESSAGE DETAILS');
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${new Date().toLocaleString()}`);

    if (typeof window !== 'undefined' && window.alert) {
      setTimeout(() => {
        alert(`MOCK SMS SENT!\n\nTo: ${phoneNumber}\nMessage: ${message}\n\nTime: ${new Date().toLocaleString()}\n\n(This is a mock service. In production, a real SMS would be sent)`);
      }, 100);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
      throw new Error('Mock SMS service failure');
    }

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      provider: 'mock',
      timestamp: new Date().toISOString(),
      cost: 0.00,
      deliveryStatus: 'sent'
    };
  }

  formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    return phoneNumber;
  }

  validatePhoneNumber(phoneNumber) {
    const indianMobileRegex = /(\+91|91)?[6789]\d{9}$/;
    const cleaned = phoneNumber.replace(/\D/g, '');
    return indianMobileRegex.test(cleaned) || indianMobileRegex.test(`91${cleaned}`);
  }
}

// Email Service Integration

class EmailService {
  constructor() {
    this.apiKey = process.env.REACT_APP_EMAIL_API_KEY || 'mock-api-key';
    this.serviceProvider = process.env.REACT_APP_EMAIL_PROVIDER || 'mock';
  }

  async sendEmail(to, subject, message, isHTML = false) {
    console.log(`Email Service: Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    try {
      if (this.serviceProvider === 'sendgrid') {
        return await this.sendViaSendGrid(to, subject, message, isHTML);
      } else if (this.serviceProvider === 'ses') {
        return await this.sendViaAWSSES(to, subject, message, isHTML);
      } else {
        return await this.mockSendEmail(to, subject, message, isHTML);
      }
    } catch (error) {
      console.error('Email Service Error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendViaSendGrid(to, subject, message, isHTML) {
    const apiKey = process.env.REACT_APP_SENDGRID_API_KEY;
    const fromEmail = process.env.REACT_APP_FROM_EMAIL || 'noreply@bonstay.com';

    const emailData = {
      personalizations: [{ to: [{ email: to }], subject }],
      from: { email: fromEmail, name: 'Bonstay Admin' },
      content: [{ type: isHTML ? 'text/html' : 'text/plain', value: message }],
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    return {
      success: true,
      messageId: response.headers.get('X-Message-Id'),
      provider: 'sendgrid',
      timestamp: new Date().toISOString(),
    };
  }

  async mockSendEmail(to, subject, message, isHTML) {
    console.log('MOCK EMAIL SERVICE MESSAGE DETAILS');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content Type: ${isHTML ? 'HTML' : 'Text'}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${new Date().toLocaleString()}`);

    if (typeof window !== 'undefined' && window.alert) {
      setTimeout(() => {
        alert(`MOCK EMAIL SENT!\n\nTo: ${to}\nSubject: ${subject}\n\nTime: ${new Date().toLocaleString()}\n\n(This is a mock service. In production, a real email would be sent)`);
      }, 200);
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      messageId: `email-mock-${Date.now()}`,
      provider: 'mock',
      timestamp: new Date().toISOString(),
      deliveryStatus: 'sent',
    };
  }
}

// Singleton Instances
const smsService = new SMSService();
const emailService = new EmailService();

export { smsService, emailService };

// Utility functions for admin code management

export const AdminCodeUtils = {
  generateAdminCode: () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ADMIN${timestamp}${random}`;
  },

  validateAdminCode: (code) => {
    return code && code.startsWith('ADMIN') && code.length >= 10;
  },

  formatAdminCodeMessage: (code, userName) => {
    return `Hello ${userName}, Your Bonstay Admin Access Code is: ${code}. This code is valid for registration. Please keep it secure and do not share with unauthorized persons. Valid until you use it for registration.`;
  },

  formatApprovalEmails: (userName, phoneNumber) => {
    return {
      subject: 'Admin Access Request Approved',
      message: `Dear ${userName},

Your request for admin access to the Bonstay management system has been approved!

The admin code has been sent to your registered mobile number: ${phoneNumber}

Please use this code during registration to create your admin account.

Important Notes:
- The code is case-sensitive
- Use it only for your registration
- Do not share this code with others

Contact support if you face any issues.

Best regards,  
Bonstay Admin Team

This is an automated message. Please do not reply to this email.`,
    };
  },

  formatRejectionEmail: (userName, reason = '') => {
    return {
      subject: 'Admin Access Request - Status Update',
      message: `Dear ${userName},

Thank you for your interest in admin access to the Bonstay management system.

After careful review, we are unable to approve your request at this time.

${reason ? `\nReason: ${reason}` : ''}

If you believe this is an error or would like to provide additional information, please contact our support team.

Best regards,  
Bonstay Admin Team

This is an automated message. Please do not reply to this email.`,
    };
  },
};
