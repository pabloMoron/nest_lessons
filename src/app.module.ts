import { Module } from '@nestjs/common'
import { TasksModule } from 'src/tasks/tasks.module'
import { AuthModule } from 'src/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './tasks/task.entity'
import { User } from './auth/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configValidationSchema from './config.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      // Esto nos va a indicar si falta alguna variable de configuracion
      validationSchema: configValidationSchema
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Se usa esta configuracion porque se necesita que el modulo de config
      // este disponible, entonces con forRootAsync podemos meter inyecciones de dependencias del ConfigService
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          autoLoadEntities: true,
          synchronize: true,
          entities: [Task, User]
        }
      },
    }),
    AuthModule,
  ]
})
export class AppModule { }
