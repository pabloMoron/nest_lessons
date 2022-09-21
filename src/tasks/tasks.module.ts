import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { TaskRepository } from './task.repository'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
  // Importo Authmodule para pedir tokens en todo el controlador
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule { }
