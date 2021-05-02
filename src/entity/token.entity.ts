import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
 
@Entity()
export class Token extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number


    @Column()
    user_id: number
  
    @Column()
    is_revoked: boolean

    static updateRevoked(userid: number) {
        return this.createQueryBuilder('token')
            .update('token')
            .set({ is_revoked: true})
            .where("token.user_id = :userid", { userid })
            .execute();
    }
}