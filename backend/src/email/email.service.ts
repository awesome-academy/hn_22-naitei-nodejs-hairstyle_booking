import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { transporter } from './email.config';

@Injectable()
export class EmailService {
  async sendOtpEmail(email: string, otpCode: string, purpose: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Mã OTP ${purpose} - Hair Booking Salon`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center;">
            <h1>Hair Booking Salon</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Mã OTP ${purpose}</h2>
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu ${purpose.toLowerCase()}. Mã OTP của bạn là:</p>
            <div style="background-color: white; padding: 15px; text-align: center; border: 2px dashed #ec4899; margin: 20px 0;">
              <h1 style="color: #ec4899; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
            </div>
            <p><strong>Lưu ý:</strong> Mã OTP này có hiệu lực trong <strong>5 phút</strong>.</p>
            <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              Trân trọng,<br>
              Đội ngũ Hair Booking Salon
            </p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Không thể gửi email OTP");
    }
  }

  async sendPasswordResetOtp(email: string, otpCode: string): Promise<void> {
    await this.sendOtpEmail(email, otpCode, "Đặt lại mật khẩu");
  }
}