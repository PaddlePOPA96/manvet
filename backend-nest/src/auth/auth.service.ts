import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  private async validateUser(
    email: string,
    password: string
  ): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { email },
      relations: ["role"]
    });
    if (!user) {
      throw new UnauthorizedException("Email atau password salah");
    }

    const storedHash = user.password || "";

    // Coba verifikasi dengan bcrypt terlebih dahulu
    const isBcryptHash = storedHash.startsWith("$2a$") ||
      storedHash.startsWith("$2b$") ||
      storedHash.startsWith("$2y$");

    let isValid = false;
    if (isBcryptHash) {
      isValid = await bcrypt.compare(password, storedHash);
    } else {
      // Fallback dev: bandingkan plain text
      isValid = password === storedHash;
    }

    if (!isValid) {
      throw new UnauthorizedException("Email atau password salah");
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || "user"
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: payload.role
      }
    };
  }
}

