import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {

    }

    getAll(): Promise<User[]> {
        return this.userRepository.find()
    }


    async getOneById(id: number): Promise<User> {
        var user;
        user= await this.userRepository.findOneOrFail(id)
        return user;
    }




    async createUser(name: string, email: string, phone: number, password: string): Promise<User> {
        const newUser = this.userRepository.create({ name, email, phone, password });
        return this.userRepository.save(newUser);



    }

    async updateUser(id: number, name?: string, email?: string, phone?: number, password?: string): Promise<User> {
        const user = await this.getOneById(id);
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.phone = phone || user.phone;
        return this.userRepository.save(user);

    }

    async deleteUser(id: number): Promise<User> {
        const duser = await this.getOneById(id);
        return this.userRepository.remove(duser);
    }







}