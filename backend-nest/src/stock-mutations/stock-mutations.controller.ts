import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards
} from "@nestjs/common";
import { CreateStockMutationDto } from "./dto/create-stock-mutation.dto";
import { StockMutationsService } from "./stock-mutations.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("stock-mutations")
@UseGuards(JwtAuthGuard)
export class StockMutationsController {
  constructor(private readonly service: StockMutationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateStockMutationDto) {
    try {
      return await this.service.create(body);
    } catch (e: any) {
      throw new HttpException(
        {
          error:
            e?.message ||
            "Failed to create stock mutation"
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
