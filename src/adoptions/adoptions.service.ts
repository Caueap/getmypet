import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Adoption, AdoptionDocument } from './adoption.schema';
import { Pet, PetDocument } from '../pets/pet.schema';
import { User, UserDocument } from '../users/user.schema';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectModel(Adoption.name) private adoptionModel: Model<AdoptionDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createAdoptionDto: CreateAdoptionDto, applicantId: string): Promise<Adoption> {

    const existingApplication = await this.adoptionModel.findOne({
      petId: createAdoptionDto.petId,
      applicantId: applicantId,
      status: 'pending',
      isActive: true,
    });

    if (existingApplication) {
      throw new ConflictException('You already have a pending application for this pet');
    }

    const createdAdoption = new this.adoptionModel({
      ...createAdoptionDto,
      applicantId,
      status: 'pending',
      applicationDate: new Date(),
    });

    return createdAdoption.save();
  }

  async findAll(): Promise<Adoption[]> {
    return this.adoptionModel
      .find({ isActive: true })
      .populate('petId', 'name species breed images')
      .populate('applicantId', 'name email phone')
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Adoption> {
    const adoption = await this.adoptionModel
      .findById(id)
      .populate('petId', 'name species breed images')
      .populate('applicantId', 'name email phone address')
      .populate('ownerId', 'name email')
      .exec();

    if (!adoption) {
      throw new NotFoundException('Adoption application not found');
    }
    return adoption;
  }

  async findByApplicant(applicantId: string): Promise<Adoption[]> {
    return this.adoptionModel
      .find({ applicantId, isActive: true })
      .populate('petId', 'name species breed images')
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByOwner(ownerId: string): Promise<Adoption[]> {
    return this.adoptionModel
      .find({ ownerId, isActive: true })
      .populate('petId', 'name species breed images')
      .populate('applicantId', 'name email phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPet(petId: string): Promise<Adoption[]> {
    return this.adoptionModel
      .find({ petId, isActive: true })
      .populate('applicantId', 'name email phone')
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateAdoptionDto: UpdateAdoptionDto): Promise<Adoption> {
    const updateData: any = { ...updateAdoptionDto };
    let currentAdoption: Adoption | null = null;

    if (updateAdoptionDto.status === 'completed') {
      currentAdoption = await this.adoptionModel.findById(id);
      if (!currentAdoption) {
        throw new NotFoundException('Adoption application not found');
      }
      
      if (currentAdoption.status !== 'approved') {
        throw new ConflictException('Adoption can only be completed if it has been approved first');
      }
    }

    if (updateAdoptionDto.status && updateAdoptionDto.status !== 'pending') {
      updateData.responseDate = new Date();
    }

    if (updateAdoptionDto.status === 'completed') {
      updateData.completionDate = new Date();
      
      if (!currentAdoption) {
        currentAdoption = await this.adoptionModel.findById(id);
        if (!currentAdoption) {
          throw new NotFoundException('Adoption application not found');
        }
      }
      
      await this.transferPetOwnership(currentAdoption.petId.toString(), currentAdoption.ownerId.toString(), currentAdoption.applicantId.toString());
    }

    const updatedAdoption = await this.adoptionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('petId', 'name species breed images')
      .populate('applicantId', 'name email phone')
      .populate('ownerId', 'name email')
      .exec();

    if (!updatedAdoption) {
      throw new NotFoundException('Adoption application not found');
    }

    return updatedAdoption;
  }

  private async transferPetOwnership(petId: string, oldOwnerId: string, newOwnerId: string): Promise<void> {
    await this.petModel.findByIdAndUpdate(petId, {
      ownerId: newOwnerId,
      adoptedBy: newOwnerId,
      adoptedAt: new Date(),
      status: 'adopted'
    });

    await this.userModel.findByIdAndUpdate(oldOwnerId, {
      $pull: { pets: petId }
    });

    await this.userModel.findByIdAndUpdate(newOwnerId, {
      $push: { pets: petId }
    });
  }

  async completeAdoption(adoptionId: string): Promise<Adoption> {
    return this.update(adoptionId, { status: 'completed' });
  }

  async remove(id: string): Promise<void> {
    const result = await this.adoptionModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Adoption application not found');
    }
  }

  async getStatistics(): Promise<any> {
    const total = await this.adoptionModel.countDocuments({ isActive: true });
    const pending = await this.adoptionModel.countDocuments({ status: 'pending', isActive: true });
    const approved = await this.adoptionModel.countDocuments({ status: 'approved', isActive: true });
    const completed = await this.adoptionModel.countDocuments({ status: 'completed', isActive: true });
    const rejected = await this.adoptionModel.countDocuments({ status: 'rejected', isActive: true });

    return {
      total,
      pending,
      approved,
      completed,
      rejected,
    };
  }
} 