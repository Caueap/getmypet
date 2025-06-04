import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Adoption, AdoptionDocument } from './adoption.schema';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectModel(Adoption.name) private adoptionModel: Model<AdoptionDocument>,
  ) {}

  async create(createAdoptionDto: CreateAdoptionDto): Promise<Adoption> {
    // Check if there's already a pending application for this pet by this user
    const existingApplication = await this.adoptionModel.findOne({
      petId: createAdoptionDto.petId,
      applicantId: createAdoptionDto.applicantId,
      status: 'pending',
      isActive: true,
    });

    if (existingApplication) {
      throw new ConflictException('You already have a pending application for this pet');
    }

    const createdAdoption = new this.adoptionModel({
      ...createAdoptionDto,
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

    if (updateAdoptionDto.status && updateAdoptionDto.status !== 'pending') {
      updateData.responseDate = new Date();
    }

    if (updateAdoptionDto.status === 'completed') {
      updateData.completionDate = new Date();
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