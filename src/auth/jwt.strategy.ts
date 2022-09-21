import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "./jwt-payload-interface";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get("JWT_SECRET"), // Debe ser igual que en la declaracion de JwtModule.register (auth.module.ts)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Extrae automaticamente el header Authorization
        })
    }


    // Si el token es valido invoca esta funcion
    // Si no es valido ya lanza un 401 unauthorized
    async validate (payload: Payload): Promise<User> {

        const { username } = payload
        const user: User = await this.usersRepository.findOne({
            where: {
                username: username
            }
        })
        if(! user){
            throw new UnauthorizedException('Invalid user or password')
        }
        console.log(user)

        // Retorna el objeto user y lo coloca en Request.user. Ya queda disponible para los controladores
        return user
    }
}