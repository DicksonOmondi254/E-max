"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendPasswordResetEmail = async (email, resetToken) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: `"${process.env.FROM_NAME || "E-Max Store"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset Your E-Max Password",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#2563EB,#60A5FA);padding:40px 32px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">E-Max Store</h1>
                    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Password Reset Request</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px 32px;">
                    <h2 style="color:#1e293b;font-size:20px;margin:0 0 16px;">Hello,</h2>
                    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
                      We received a request to reset the password for your E-Max Store account. 
                      Click the button below to set a new password. This link will expire in <strong>15 minutes</strong>.
                    </p>
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                      <tr>
                        <td align="center" style="background:linear-gradient(135deg,#2563EB,#60A5FA);border-radius:8px;padding:0;">
                          <a href="${resetLink}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 8px;">
                      If the button above doesn't work, copy and paste the following link into your browser:
                    </p>
                    <p style="color:#2563EB;font-size:13px;line-height:1.5;word-break:break-all;margin:0 0 24px;background:#f8fafc;padding:12px;border-radius:6px;border:1px solid #e2e8f0;">
                      ${resetLink}
                    </p>
                    <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
                      If you did not request a password reset, please ignore this email. 
                      Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                    <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">
                      &copy; ${new Date().getFullYear()} E-Max Store. All rights reserved.
                    </p>
                    <p style="color:#94a3b8;font-size:12px;margin:0;">
                      This is an automated message. Please do not reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
