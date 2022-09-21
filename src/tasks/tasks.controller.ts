import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-feature.dto';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/gget-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger: Logger = new Logger('TaskController')

  constructor(
    private tasksService: TasksService) {
    // En otros lenguajes se hace algo similar a lo siguiente para injectar la dependencia
    // this.taskService = tasksService
    // Esto funciona pero hay una mejor manera de hacerlo
    // Esta manera es asignar el modificador de acceso en el constructor -- private
  }
  @Get(":id")
  getTaskbyId(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User: "${user.username}" getting task with id "${id}"`)
    return this.tasksService.getTaskById(id, user)
  }

  @Get()
  getTasks(
    @Query() taskFilterDto: GetTaskFilterDto,
    @GetUser() user: User
  ): Promise<Task[]>{
    this.logger.verbose(`User: "${user.username}" retreiving all tasks. Filers: ${JSON.stringify(taskFilterDto)}`)
    return this.tasksService.getTasks(taskFilterDto, user)
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task>{
    this.logger.verbose(`User: "${user.username}" creating a new task, Data: "${JSON.stringify(createTaskDto)}"`)
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Delete(":id")
  deleteTaskById(
    @GetUser() user: User,
    @Param('id') id: string
  ): Promise<void>{
    this.logger.verbose(`User: "${user.username}" deleting task with id: "${id}"`)
    return this.tasksService.deleteTaskById(id, user)
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @GetUser() user: User,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ):Promise<Task>{
    this.logger.verbose(`User: "${user.username}" updating task status, id: ${JSON.stringify(id) }, status: "${updateTaskStatusDto.status}"`)
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user)
  }
}