import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./dto/task-status.enum";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string
    
    @Column()
    description: string
    
    @Column()
    status: TaskStatus

    @ManyToOne(_type => User, user => user.tasks, { eager: false }) //Mapea la relacion en bd, eager explicado en User.entity.ts
    // Cuando se imprime o se devuelve un objeto Task en formato json, se excluye esta propiedad
    // Si no excluyo esta propiedad se devuelve todo el objeto, incluyendo la contraseña guardada en la bd
    @Exclude({ toPlainOnly: true})
    user: User
}