import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ isActive: true })
      .select('-password')
      .populate('pets', 'name species breed size age gender description status vaccinations isNeutered location')
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('pets', 'name species breed size age gender description status vaccinations isNeutered location')
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData: any = { ...updateUserDto };
    
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .populate('pets', 'name species breed size age gender description status vaccinations isNeutered location')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    console.log(`UsersService - Starting remove for user ID: ${id}`);
    
    console.log(`UsersService - Finding user by ID...`);
    const user = await this.userModel.findById(id);
    
    if (!user) {
      console.log(`UsersService - User not found`);
      throw new NotFoundException('User not found');
    }
    
    console.log(`UsersService - Found user: ${user.name}, pets array length: ${user.pets?.length || 0}`);
    console.log(`UsersService - User pets:`, user.pets);

    if (user.pets && user.pets.length > 0) {
      console.log(`UsersService - User has pets, throwing ConflictException`);
      throw new ConflictException('Cannot delete user who has registered pets. Please remove or transfer all pets first.');
    }

    console.log(`UsersService - User has no pets, proceeding with soft delete...`);
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      console.log(`UsersService - Failed to update user to inactive`);
      throw new NotFoundException('User not found');
    }
    
    console.log(`UsersService - User successfully marked as inactive`);
  }
} 