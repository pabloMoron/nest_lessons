import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-feature.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) { }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user
      }
    })
    if (task) {
      return task
    }

    //sino=> throw new NotFoundException()
    // 👆 En express sería:
    // res.status(404)
    // res.json({
    // "statusCode": 404,
    // "message": "Not Found"
    // })

    // Tambien se puede personalizar la respuesta
    throw new NotFoundException(`Task with id: ${id} not found`)
  }
  async getTasks(taskFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDto, user)
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
    return this.taskRepository.createTask(createTaskDto, user)
  }

  deleteTaskById(id: string, user: User): Promise<void>{
    return this.taskRepository.deleteTaskById(id, user)
  }

  async updateTaskStatus(id: string, updateTaskStatus: UpdateTaskStatusDto, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user) // 👈 Aqui ya hay un control si no encuentra
    task.status = updateTaskStatus.status
    await this.taskRepository.save(task)
    return task
  }
}