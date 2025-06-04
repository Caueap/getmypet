import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { Adoption, AdoptionSchema } from './adoption.schema';
import { Pet, PetSchema } from '../pets/pet.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Adoption.name, schema: AdoptionSchema },
      { name: Pet.name, schema: PetSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
  exports: [AdoptionsService],
})
export class AdoptionsModule {} 