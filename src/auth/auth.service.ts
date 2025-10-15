import { BadGatewayException, BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { IUser } from "src/common";
import { ConfirmEmailDto, ForgetPasswordDto, GoogleSignupDto, LoginBodyDto, ResetPasswordDto, SignupBodyDto } from "./dto/signup.dto";
import { UserRepository } from './../DB/repository/user.repository';
import { compareHash, generateHash } from "src/common/utils/security/hash.security";
import { TokenSecurity } from 'src/common/utils/security/token.security';
import { generateNumberOtp } from 'src/common/utils/email/otp';
import { sendEmail } from 'src/common/utils/email/send.email';
import { verifyEmail } from 'src/common/utils/email/verify.template';
import { resetPasswordEmail } from 'src/common/utils/email/reset-password.template';
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { ProviderEnum } from "src/common/enums/user.enum";
import { OtpRepository } from "src/DB/repository/otp.repository";
import { otpEnum } from "src/common/enums/otp.enum";



@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenSecurity: TokenSecurity,
    private readonly otpRepository: OtpRepository
  ) {}
  private async verifyGmailAccount(idToken:string):Promise<TokenPayload>{
    const client=new OAuth2Client();
    const ticket=await client.verifyIdToken({
        idToken,
        audience:process.env.WEB_CLIENT_IDS?.split(",")||[]
    })
    const payload=ticket.getPayload()
    if(!payload?.email_verified){
        throw new BadRequestException("fail to verify google acc")
    }
    return payload
}


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
 
 const otpRecord=await this.otpRepository.create({
  data:{
      code:otp,
      expiredAt:new Date(Date.now()+15*60*1000),
      createdBy:user._id.toString(),
      type:otpEnum.ConfirmEmail
  }
 })

 

 
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
    
    if (!user.confrimEmailOtp) {
      throw new ConflictException('No OTP found for this email');
    }
    
    const isValidOtp = await compareHash(otp, user.confrimEmailOtp);
    if (!isValidOtp) {
      throw new ConflictException('Invalid OTP code');
    }
    
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
    
    const otp = generateNumberOtp();
    
    const encryptedOtp = await generateHash(otp.toString());
    
    await this.userRepository.updateOne({
      filter: { email },
      update: {
        confrimEmailOtp: encryptedOtp,
        confirmEmailAt: new Date()
      }
    });
    
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
  async forgetPassword(data: ForgetPasswordDto): Promise<{ message: string }> {
    const { email } = data;
    const user = await this.userRepository.findOne({ filter: { email } });
    
    if (!user) {
      throw new ConflictException('User not found');
    }

    if (!user.confirmEmail) {
      throw new ConflictException('Please confirm your email first');
    }

    const otp = generateNumberOtp();
    const encryptedOtp = await generateHash(otp.toString());

    await this.userRepository.updateOne({
      filter: { email },
      update: {
        resetPasswordOtp: encryptedOtp,
        resetPasswordAt: new Date()
      }
    });

    try {
      await sendEmail({
        to: email,
        subject: "Password Reset - OTP Code",
        html: resetPasswordEmail({ 
          otp: otp, 
          title: "Password Reset Request" 
        })
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    return { message: "Password reset code sent to your email" };
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = data;
    const user = await this.userRepository.findOne({ filter: { email } });
    
    if (!user) {
      throw new ConflictException('User not found');
    }
     
    if (!user.resetPasswordOtp) {
      throw new ConflictException('No password reset request found for this email');
    }
    
    const isValidOtp = await compareHash(otp, user.resetPasswordOtp);
    if (!isValidOtp) {
      throw new ConflictException('Invalid OTP code');
    }
    
    const otpExpiry = new Date(user.resetPasswordAt!.getTime() + 15 * 60 * 1000);
    if (new Date() > otpExpiry) {
      throw new ConflictException('OTP code has expired');
    }
    
    const isSamePassword = await compareHash(newPassword, user.password);
    if (isSamePassword) {
      throw new ConflictException('New password must be different from current password');
    }
    
    await this.userRepository.updateOne({ 
      filter: { email }, 
      update: { 
        password: newPassword,
        resetPasswordOtp: undefined,
        resetPasswordAt: undefined,
        changeCredentials: new Date()
      } 
    });
    
    return { message: "Password reset successfully" };
  }
  async signupGoogle(data: GoogleSignupDto): Promise<{ 
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
    const { idToken } = data;
    const { email, family_name, given_name, picture }: TokenPayload = await this.verifyGmailAccount(idToken);
    
    const user = await this.userRepository.findOne({ filter: { email } });
    if (user) {
      if (user.provider === ProviderEnum.GOOGLE) {
        return await this.LoginWithGmail(data);
      }
      throw new ConflictException(`Email exists with another provider: ${user.provider}`);
    }
    
    const newUser = await this.userRepository.create({
      data: {
        email,
        provider: ProviderEnum.GOOGLE,
        firstName: given_name,
        lastName: family_name,
        confirmEmail: new Date(), 
        changeCredentials: new Date()
      }
    });
    
    if (!newUser) {
      throw new BadGatewayException('Failed to create Google account');
    }
    
    return await this.LoginWithGmail(data);
  }

  async LoginWithGmail(data: GoogleSignupDto): Promise<{ 
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
    const { idToken } = data;
    const { email }: TokenPayload = await this.verifyGmailAccount(idToken);
    
    const user = await this.userRepository.findOne({ filter: { email } });
    if (!user) {
      throw new ConflictException('User not found');
    }
    
    if (user.provider !== ProviderEnum.GOOGLE) {
      throw new ConflictException('User is not a Google account');
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
      message: 'Google login successful',
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
