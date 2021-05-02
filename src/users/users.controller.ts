import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }


    @Get(':id')
    async getOne(@Param('id') id: number) {
        const data = await this.usersService.getOneById(id)

            .then(response => {
                //    console.log("the responsee in then is.....", response)
                return response
            })

            .catch(response => {

                throw response
            })
        return data
    }


    @Get()
    getDocs(): Promise<User[] | User> {

        return this.usersService.getAll();

    }



    @Post()
    async create(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('phone') phone: number,
        @Body('password') password: string,

    ): Promise<any> {
        //console.log("the received data in post request create funcations are")
        console.log(name, email, phone, password);

        const user = await this.usersService.createUser(name, email, phone, password)
            .then(res => {
                //console.log("response in then  statement of post is", res)
                return res
            })
            .catch(res => {
                //console.log("response in catch stmmt of post is ::",res)
                //return res
                throw res
            })

        return user
    }



    @Put()
    update(
        @Body('id') id: number,
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('phone') phone: number,
        @Body('dob') dob: any
    ) {
        console.log(id, name, email, phone, dob)
        if (!id)
            throw new Error("you must provide id")
        return this.usersService.updateUser(id, name, email, phone, dob)
    }


    @Delete(':id')
    deleteuser(@Param('id') id: number) {
        // console.log("id is............", id)
        return this.usersService.deleteUser(id);

    }









}