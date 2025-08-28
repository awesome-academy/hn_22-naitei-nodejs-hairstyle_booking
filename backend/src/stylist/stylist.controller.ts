import { Controller, Get, Query, Req } from "@nestjs/common";
import { StylistService } from "./stylist.service";
import { Public } from "../common/decorators/public.decorator";
import { GetStylistsQueryDto } from "./dto/get-stylists-query.dto";
import { StylistListResponseDto } from "./dto/stylist-response.dto";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";

@Controller("stylists")
export class StylistController {
  constructor(
    private readonly stylistService: StylistService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Get()
  async getAllStylists(
    @Query() query: GetStylistsQueryDto,
    @Req() req: Request,
  ): Promise<StylistListResponseDto> {
    let userId: string | null = null;
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const payload = this.jwtService.decode(token) as JwtPayload;
        userId = payload?.id ?? null;
      } catch {
        userId = null;
      }
    }
    return this.stylistService.getListByCustomer(query, userId);
  }
}
