import { IsNotEmpty } from "class-validator"
// Agregamos decoradores de lo paquetes class-validator, cuando se quieran mapear
// DTOs desde las request, el pipe declarado los validará y lanzará los errores correspondientes

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string
}

