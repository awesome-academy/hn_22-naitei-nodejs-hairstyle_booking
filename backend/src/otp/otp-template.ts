export function generateOtpHtml(otpCode: string, purpose: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center;">
        <h1>Hair Booking Salon</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2>OTP Code for ${purpose}</h2>
        <p>Hello,</p>
        <p>You have requested ${purpose.toLowerCase()}. Your OTP code is:</p>
        <div style="background-color: white; padding: 15px; text-align: center; border: 2px dashed #ec4899; margin: 20px 0;">
          <h1 style="color: #ec4899; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
        </div>
        <p><strong>Note:</strong> This OTP code is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          Hair Booking Salon Team
        </p>
      </div>
    </div>
  `;
}
