import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards
} from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  async getAllFlat() {
    return this.service.findFlat();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateTransactionDto) {
    try {
      return await this.service.create(body);
    } catch (e: any) {
      throw new HttpException(
        {
          error:
            e?.message ||
            "Failed to create transaction"
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
