import { BadGatewayException, ConflictException, Injectable } from "@nestjs/common";
import { IUser } from "src/common";
import { LoginBodyDto, SignupBodyDto } from "./dto/signup.dto";
import { UserRepository } from './../DB/repository/user.repository';
import { compareHash, generateHash } from "src/common/utils/security/hash.security";
import { TokenSecurity } from 'src/common/utils/security/token.security';



@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenSecurity: TokenSecurity
  ) {}


async signup(data:SignupBodyDto):Promise<string>{
 const {email ,password ,username} =data
 const checkUserExist=await this.userRepository.findOne({filter:{email}})
 if(checkUserExist){
    throw new ConflictException('user already exists')
 }
 const user=await this.userRepository.create({
    data:{username,email,password},
 })
 if(!user){
    throw new BadGatewayException("fail to signup this acc ")
 }
    return "done"
}

  async login(data: LoginBodyDto): Promise<{ 
    message: string; 
    data: { 
      accessToken: string;
      refreshToken: string;
      user: {
        id: number;
        username: string;
        email: string;
      }
    } 
  }> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ filter: { email } });
    
    if (!user) {
      throw new ConflictException('invalid login data');
    }
    
    if (!(await compareHash(password, user.password))) {
      throw new ConflictException('invalid login data');
    }
    
    const accessToken = this.tokenSecurity.generateAccessToken({
      sub: user.id,
      email: user.email,
      username: user.username
    });
    
    const refreshToken = this.tokenSecurity.generateRefreshToken({
      sub: user.id,
      email: user.email,
      username: user.username
    });
    
    return {
      message: "Login successful",
      data: { 
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    };
  }


}
