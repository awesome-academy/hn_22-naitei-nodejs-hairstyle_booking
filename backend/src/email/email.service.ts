import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { transporter } from "./email.config";
import { generateOtpHtml } from "src/otp/otp-template";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
@Injectable()
export class EmailService {
  async sendOtpEmail(
    email: string,
    otpCode: string,
    purpose: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `OTP Code for ${purpose} - Hair Booking Salon`,
      html: generateOtpHtml(otpCode, purpose),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(ERROR_MESSAGES.OTP.EMAIL_SEND_FAILED);
    }
  }

  async sendPasswordResetOtp(email: string, otpCode: string): Promise<void> {
    await this.sendOtpEmail(email, otpCode, "Password Reset");
  }
}
