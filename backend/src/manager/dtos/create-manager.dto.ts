import { RegisterDto } from "../../auth/dtos/register.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateManagerDto extends RegisterDto {
  @IsNotEmpty()
  @IsString()
  salonId: string;
}
