import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenSecurity {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: any): string {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
  }

  verifyToken(token: string, isRefresh = false): any {
    try {
      return this.jwtService.verify(token, {
        secret: isRefresh 
          ? (process.env.JWT_REFRESH_SECRET )
          : (process.env.JWT_SECRET)
      });
    } catch (e) {
      return null;
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
