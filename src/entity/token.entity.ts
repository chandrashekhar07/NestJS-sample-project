import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
 
@Entity()
export class Token{
    @PrimaryGeneratedColumn()
    id:number


    @Column()
    user_id: number
  
    @Column()
    is_revoked: boolean
   
     
}