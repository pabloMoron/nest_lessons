import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Payload } from './jwt-payload-interface';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UsersRepository)
        private userRepository: UsersRepository,
        private jwtService: JwtService
        ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{token: string}> {
        const {username, password} = authCredentialsDto
        const user = await this.userRepository.findOne({
            where:{
                username: username
            }
        })

        
        if(user && (await bcrypt.compare(password, user.password))) {
            const payload: Payload = { username }
            const token = this.jwtService.sign(payload)
            return { token }
        }
        
        throw new UnauthorizedException('Invalid user or password')
    }
}
