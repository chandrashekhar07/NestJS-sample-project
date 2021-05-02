import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { Token } from 'src/entity/token.entity';
import { User } from 'src/entity/user.entity';
 
import { AuthenticationService } from './authentication.service';
 

export interface AuthenticationPayload {
    user: User
    payload: {
      type: string
      token: string
      refresh_token?: string
    }
  }



@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService
            
             
        ) { }


        @Post('/refresh')
        public async refresh (@Body('refresh_token') refresh_token: string) {
      
          const { user, token } = await this.authenticationService.createAccessTokenFromRefreshToken(refresh_token)
      
          const payload = this.buildResponsePayload(user, token)
      
          return {
            status: 'success',
            data: payload,
          }
        }

        @Post('/logout')
        async logout(@Body('token') token:string){
        const obj = await this.authenticationService.decodeAccessToken(token)

        Token.updateRevoked(obj.sub)
        console.log("access decoded obj is......",obj)    
        return obj
        }




        
  @Post('login')
  async Login(
    @Body('id') id:number,
    @Body('password') password:string,
  
  ){
    const user = await User.findOneOrFail(id);
    //const user = await this.userService.userRepository.findOneOrFail(id)

    if (!user)
     throw new BadRequestException("invalid credential in logiin")

    if (!(user.password === password))     
      throw new BadRequestException("password mismatch")
   
   const accesstoken = await this.authenticationService.generateAccessToken(user) 

    console.log("acess token in login is.....",accesstoken)

   const refreshtoken = await this.authenticationService.generateRefreshToken(user,600)
    
   console.log("refresh token in login is............",refreshtoken)

    
   const payload = this.buildResponsePayload(user, accesstoken, refreshtoken)


   return {
    
    data: payload
  }
    
  }  




        private buildResponsePayload (user: User, accessToken: string, refreshToken?: string): AuthenticationPayload {
            return {
              user: user,
              payload: {
                type: 'bearer',
                token: accessToken,
                ...(refreshToken ? { refresh_token: refreshToken } : {}),
              }
            }
          }
}
