import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from './pet.schema';
import { User, UserDocument } from '../users/user.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createPetDto: CreatePetDto, ownerId: string): Promise<Pet> {
    const createdPet = new this.petModel({
      ...createPetDto,
      ownerId,
      originalOwnerId: ownerId,
      status: 'available',
    });
    
    const savedPet = await createdPet.save();
    
    
    await this.userModel.findByIdAndUpdate(
      ownerId,
      { $push: { pets: savedPet._id } }
    );
    
    return savedPet;
  }

  async findAll(filters?: any): Promise<Pet[]> {
    const query = { isActive: true, ...filters };
    return this.petModel
      .find(query)
      .populate('ownerId', 'name email avatar phone address city state')
      .populate('adoptedBy', 'name email avatar phone address city state')
      .exec();
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petModel
      .findById(id)
      .populate('ownerId', 'name email avatar phone address city state')
      .populate('adoptedBy', 'name email avatar phone address city state')
      .exec();

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    return pet;
  }

  async findByOwner(ownerId: string): Promise<Pet[]> {
    return this.petModel
      .find({ 
        $or: [
          { ownerId, isActive: true },
          { originalOwnerId: ownerId, isActive: true }
        ]
      })
      .populate('ownerId', 'name email avatar phone address city state')
      .populate('originalOwnerId', 'name email avatar phone address city state')
      .populate('adoptedBy', 'name email avatar phone address city state')
      .exec();
  }

  async findAvailable(filters?: any): Promise<Pet[]> {
    const query = { status: 'available', isActive: true, ...filters };
    return this.petModel
      .find(query)
      .populate('ownerId', 'name email avatar phone address city state')
      .exec();
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    const updatedPet = await this.petModel
      .findByIdAndUpdate(id, updatePetDto, { new: true })
      .populate('ownerId', 'name email avatar phone address city state')
      .populate('adoptedBy', 'name email avatar phone address city state')
      .exec();

    if (!updatedPet) {
      throw new NotFoundException('Pet not found');
    }

    return updatedPet;
  }

  async remove(id: string): Promise<void> {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const result = await this.petModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Pet not found');
    }

    await this.userModel.findByIdAndUpdate(
      pet.ownerId,
      { $pull: { pets: id } }
    );
  }

  async adoptPet(petId: string, adopterId: string): Promise<Pet> {
    const updatedPet = await this.petModel
      .findByIdAndUpdate(
        petId,
        {
          status: 'adopted',
          adoptedBy: adopterId,
          adoptedAt: new Date(),
        },
        { new: true }
      )
      .populate('ownerId', 'name email avatar phone address city state')
      .populate('originalOwnerId', 'name email avatar phone address city state')
      .populate('adoptedBy', 'name email avatar phone address city state')
      .exec();

    if (!updatedPet) {
      throw new NotFoundException('Pet not found');
    }

    return updatedPet;
  }

  async migrateOriginalOwner(): Promise<void> {
    const petsWithoutOriginalOwner = await this.petModel.find({ 
      originalOwnerId: { $exists: false } 
    });

    for (const pet of petsWithoutOriginalOwner) {
      await this.petModel.findByIdAndUpdate(pet._id, {
        originalOwnerId: pet.ownerId
      });
    }

    console.log(`Migrated ${petsWithoutOriginalOwner.length} pets to have originalOwnerId`);
  }
} 