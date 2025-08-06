import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import {
  ManagerResponseDto,
  AuthManagerResponseDto,
} from "../manager/dtos/manager-response.dto";
import {
  CustomerResponseDto,
  AuthCustomerResponseDto,
} from "../customer/dtos/customer-response.dto";
import {
  AuthStylistResponseDto,
  StylistResponseDto,
} from "../stylist/dto/stylist-response.dto";
import { UserResponseDto } from "../user/dtos/user/user-response.dto";
import { UserService } from "../user/user.service";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";
import { PrismaService } from "src/prisma/prisma.service";
import { buildCustomerResponse } from "../user/utils/response-builder";
import { OtpService } from "../otp/otp.service";
import { EmailService } from "../email/email.service";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
} from "src/auth/dtos/forgot-password.dto";
import { OtpType } from "src/otp/enums/otp-type.enum";
import * as bcrypt from "bcrypt";
import { RoleName } from "src/common/enums/role-name.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async registerCustomer(dto: RegisterDto): Promise<AuthCustomerResponseDto> {
    const customer = await this.userService.createUserCustomer(dto);

    const payload = {
      id: customer.id,
      email: customer.email,
      role: customer.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      customer,
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<
    AuthCustomerResponseDto | AuthStylistResponseDto | AuthManagerResponseDto
  > {
    const { email, password } = dto;
    let userResponse:
      | CustomerResponseDto
      | StylistResponseDto
      | ManagerResponseDto
      | null = null;
    let userRoleName: RoleName;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }

    userRoleName = user.role.name as RoleName;

    switch (userRoleName) {
      case RoleName.CUSTOMER:
        userResponse = await this.userService.validateCustomer(email, password);
        break;
      case RoleName.STYLIST:
        userResponse = await this.userService.validateStylist(email, password);
        break;
      case RoleName.MANAGER:
        userResponse = await this.userService.validateManager(email, password);
        break;
      default:
        throw new UnauthorizedException(ERROR_MESSAGES.USER.UN_AUTH);
    }

    const payload = {
      id: userResponse.id,
      email: userResponse.email,
      role: userResponse.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    if (userResponse.role.name === RoleName.CUSTOMER) {
      return {
        access_token,
        customer: userResponse as CustomerResponseDto,
      };
    } else if (userResponse.role.name === RoleName.STYLIST) {
      return { access_token, stylist: userResponse as StylistResponseDto };
    }
    throw new Error("Unexpected user type during login response creation.");
  }

  async loginAdmin(
    dto: LoginDto,
  ): Promise<{ access_token: string; admin: UserResponseDto }> {
    const { email, password } = dto;

    const adminUser = await this.userService.validateAdmin(email, password);

    const payload = {
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role.name,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, admin: adminUser };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.getActiveUserByEmail(dto.email);

    const otpCode = await this.otpService.createOtp(
      user.id,
      OtpType.RESET_PASSWORD,
    );

    await this.emailService.sendPasswordResetOtp(dto.email, otpCode);
  }

  async verifyResetOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    const user = await this.getActiveUserByEmail(dto.email);

    const { resetToken, expiresAt } =
      await this.otpService.verifyOtpAndCreateResetToken(
        user.id,
        dto.otp,
        OtpType.RESET_PASSWORD,
      );

    return {
      message: "OTP verified successfully",
      resetToken,
      expiresAt,
    };
  }

  async resetPasswordWithToken(
    dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.getActiveUserByEmail(dto.email);

    await this.otpService.verifyResetToken(user.id, dto.resetToken);

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: "Password has been reset successfully" };
  }

  private async getActiveUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.USER_INACTIVE);
    }

    return user;
  }
}
