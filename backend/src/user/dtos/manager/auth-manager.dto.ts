import { UserResponseLoginDto } from '../user/user-response-login.dto';

export class ManagerResponseLoginDto extends UserResponseLoginDto {
  salonId: string;
  salonName: string;
  salonAddress: string;
}

export class AuthManagerResponseDto {
  access_token: string;
  manager: ManagerResponseLoginDto;
}