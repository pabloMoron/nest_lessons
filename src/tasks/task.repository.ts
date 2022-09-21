import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-feature.dto";
import { TaskStatus } from "./dto/task-status.enum";
import { Task } from "./task.entity";

// Deprecado en la typeorm 0.3 => @EntityRepository(Task)
// Una buena implementacion ahora seria enviar el datasource en el constructor
@EntityRepository(Task) 
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('Task.Repository', {timestamp: true})

    async getTasks(taskFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { search, status } = taskFilterDto
        const query = this.createQueryBuilder("task")
        query.where({ user })
        if (search) {
           query.andWhere("(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))", {search: `%${search}%`})
        }

        if(status){
            query.andWhere("task.statusa = :status",{status})
        }

        try {
            const tasks = await query.getMany()
            return tasks
        } catch (error) {
            this.logger.error(`Failed to get tasks for user: ${user.username}. Filter: ${JSON.stringify(taskFilterDto)}`, error.stack)
            throw new InternalServerErrorException()            
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto
        const task = this.create({
            title: title,
            description: description,
            status: TaskStatus.OPEN,
            user: user
        })

        await this.save(task)
        return task
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        const result = await this.delete({id, user})

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id: "${id}" not found`)
        }
    }
}