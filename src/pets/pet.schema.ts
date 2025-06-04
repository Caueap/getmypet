import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['dog', 'cat'] })
  species: string;

  @Prop()
  breed?: string;

  @Prop({ required: true, enum: ['small', 'medium', 'large'] })
  size: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, enum: ['available', 'adopted', 'pending'] })
  status: string;

  @Prop({ type: [String], default: [] })
  vaccinations: string[];

  @Prop({ default: false })
  isNeutered: boolean;

  @Prop()
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  adoptedBy?: Types.ObjectId;

  @Prop()
  adoptedAt?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet); 