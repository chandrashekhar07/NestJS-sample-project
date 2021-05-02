import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entity/token.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt';
 


export interface RefreshTokenPayload {
    jti: number;
    sub: number
}




@Injectable()
export class AuthenticationService {

    constructor(@InjectRepository(Token) private tokenRepository: Repository<Token>,
        private jwt: JwtService
       
    ) {

    }



    async createRefreshToken(user: User): Promise<any> {
        const is_revoked = false
        const user_id = user.id
        const newItem = this.tokenRepository.create({ user_id, is_revoked })

        return this.tokenRepository.save(newItem);

    }


    async generateAccessToken(user: User): Promise<string> {
        const opts: SignOptions = {

            subject: String(user.id),
        }

        return this.jwt.signAsync({}, opts)
    }

    async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
        const token = await this.createRefreshToken(user)

        const opts: SignOptions = {
            expiresIn,
            subject: String(user.id),
            jwtid: String(token.id),
        }

        return this.jwt.signAsync({}, opts)
    }

    async resolveRefreshToken(encoded: string): Promise<{ user: User, token: Token }> {
        const payload = await this.decodeRefreshToken(encoded)

        console.log("payload is...........", payload)

        const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

        if (!token) {
            throw new UnprocessableEntityException('Refresh token not found')
        }

        if (token.is_revoked) {
            throw new UnprocessableEntityException('Refresh token revoked')
        }

        const user = await this.getUserFromRefreshTokenPayload(payload)

        if (!user) {
            throw new UnprocessableEntityException('Refresh token malformed')
        }

        return { user, token }
    }

    async getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<User> {
        const subId = payload.sub

        if (!subId) {
            throw new UnprocessableEntityException('Refresh token malformed')
        }

        return User.findOneOrFail(subId)

    
    }


    private async getStoredTokenFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<Token | null> {
        const tokenId = payload.jti

        if (!tokenId) {
            throw new UnprocessableEntityException('Refresh token malformed')
        }

        return this.tokenRepository.findOne(tokenId)
        // return this.itemRepository.findTokenById(tokenId)
    }


    async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
        try {
            return this.jwt.verifyAsync(token)
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException('Refresh token expired')
            } else {
                throw new UnauthorizedException('Refresh token malformed')
            }
        }
    }



    async createAccessTokenFromRefreshToken (refresh: string): Promise<{ token: string, user: User }> {
        const { user } = await this.resolveRefreshToken(refresh)
    
        const token = await this.generateAccessToken(user)
    
        return { user, token }
      }
    

}
