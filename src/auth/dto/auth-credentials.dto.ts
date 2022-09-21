import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string
    
    @IsString()
    @MinLength(4)
    
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    // Decorador para validar con una regex
    // Esta regex: 
    // Passwords will contain at least 1 upper case letter
    // Passwords will contain at least 1 lower case letter
    // Passwords will contain at least 1 number or special character
    // There is no length validation (min, max) in this regex!
    @MaxLength(20)
    password: string
}