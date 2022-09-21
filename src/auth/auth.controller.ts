import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto)
    }

    @Post('/signin')
    singIn(
        @Body() authCredentialsDto: AuthCredentialsDto): Promise<{token: string}> {
        return this.authService.signIn(authCredentialsDto)
    }

    @Post('/test')
    @UseGuards( AuthGuard()) // 👈 Comprueba el token
    test(@Req() req){
    }
}
