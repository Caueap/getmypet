import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: userPassword, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        pets: user.pets || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const userObj = (user as any).toObject();
    const { password, ...result } = userObj;
    
    const payload = { email: result.email, sub: result._id, role: result.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        address: result.address,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode,
        avatar: result.avatar,
        role: result.role,
        isActive: result.isActive,
        pets: result.pets || [],
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }
} 