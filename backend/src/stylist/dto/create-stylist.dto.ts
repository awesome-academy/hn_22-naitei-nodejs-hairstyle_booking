import { CreateUserDto } from "../../user/dtos/user/create-user.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStylistDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  salonId: string;
}
