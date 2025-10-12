import { BadGatewayException, ConflictException, Injectable } from "@nestjs/common";
import { IUser } from "src/common";
import { ConfirmEmailDto, LoginBodyDto, SignupBodyDto } from "./dto/signup.dto";
import { UserRepository } from './../DB/repository/user.repository';
import { compareHash, generateHash } from "src/common/utils/security/hash.security";
import { TokenSecurity } from 'src/common/utils/security/token.security';
import { generateNumberOtp } from 'src/common/utils/email/otp';
import { sendEmail } from 'src/common/utils/email/send.email';
import { verifyEmail } from 'src/common/utils/email/verify.template';



@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenSecurity: TokenSecurity
  ) {}


async signup(data:SignupBodyDto):Promise<{message: string}>{
 const {email ,password ,username} =data
 const checkUserExist=await this.userRepository.findOne({filter:{email}})
 if(checkUserExist){
    throw new ConflictException('user already exists')
 }
 
 const otp = generateNumberOtp();
 
 const encryptedOtp = await generateHash(otp.toString());
 
 const user=await this.userRepository.create({
    data:{
      username,
      email,
      password,
      confrimEmailOtp:encryptedOtp,
      confirmEmailAt:new Date()
    },
 })
 
 if(!user){
    throw new BadGatewayException("fail to signup this acc ")
 }

 
 try {
   await sendEmail({
     to: email,
     subject: "Verify Your Email - OTP Code",
     html: verifyEmail({ 
       otp: otp, 
       title: "Email Verification" 
     })
   });
 } catch (emailError) {
   console.error('Failed to send verification email:', emailError);
 }
 
 return {
   message: "Account created successfully. Please check your email for verification code."
 }
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
    
    // Check if email is confirmed
    if (!user.confirmEmail) {
      throw new ConflictException('Please confirm your email before logging in');
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

  async confirmEmail(data: ConfirmEmailDto): Promise<{ message: string }> {
    const { email, otp } = data;
    const user = await this.userRepository.findOne({ filter: { email } });
    
    if (!user) {
      throw new ConflictException('User not found');
    }
    
    // Check if OTP exists
    if (!user.confrimEmailOtp) {
      throw new ConflictException('No OTP found for this email');
    }
    
    // Compare encrypted OTP with provided OTP
    const isValidOtp = await compareHash(otp, user.confrimEmailOtp);
    if (!isValidOtp) {
      throw new ConflictException('Invalid OTP code');
    }
    
    // Check if OTP is not expired (valid for 15 minutes)
    const otpExpiry = new Date(user.confirmEmailAt.getTime() + 15 * 60 * 1000);
    if (new Date() > otpExpiry) {
      throw new ConflictException('OTP code has expired');
    }
    
    await this.userRepository.updateOne({ 
      filter: { email }, 
      update: { 
        confirmEmail: new Date(),
    
      } 
    });
    
    return { message: "Email confirmed successfully" };
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ filter: { email } });
    
    if (!user) {
      throw new ConflictException('User not found');
    }
    
    if (user.confirmEmail) {
      throw new ConflictException('Email already confirmed');
    }
    
    // Generate new OTP
    const otp = generateNumberOtp();
    
    // Encrypt new OTP before storing
    const encryptedOtp = await generateHash(otp.toString());
    
    // Update user with new encrypted OTP
    await this.userRepository.updateOne({
      filter: { email },
      update: {
        confrimEmailOtp: encryptedOtp,
        confirmEmailAt: new Date()
      }
    });
    
    // Send new OTP email
    try {
      await sendEmail({
        to: email,
        subject: "New Verification Code - OTP",
        html: verifyEmail({ 
          otp: otp, 
          title: "New Email Verification Code" 
        })
      });
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
    }
    
    return { message: "New verification code sent to your email" };
  }


}
