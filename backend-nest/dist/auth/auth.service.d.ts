import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private readonly usersRepo;
    private readonly jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    private validateUser;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: string;
        };
    }>;
}
