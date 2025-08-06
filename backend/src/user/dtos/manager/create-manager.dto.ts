import { IsNotEmpty, IsString } from "class-validator";
import { RegisterDto } from "../../../auth/dtos/register.dto";

export class CreateManagerDto extends RegisterDto {
  @IsNotEmpty()
  @IsString()
  salonId: string;
}
