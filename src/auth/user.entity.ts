import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    // Columna autogenerada con el tipo uuid
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({
        unique: true
    })
    username: string
    @Column()
    password: string

    // Eager obtiene automaticamente la entidad relacionada usando cualquier metodo find
    // Solo usando querybuilder previene este comportamiento
    // Solo 1 lado de la relacion puede estar seteado en true
    @OneToMany(_type => Task, task => task.user, { eager: true })
    tasks: Task[]
}