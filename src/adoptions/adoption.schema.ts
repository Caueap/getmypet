import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdoptionDocument = Adoption & Document;

@Schema({ timestamps: true })
export class Adoption {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  applicantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, enum: ['pending', 'approved', 'rejected', 'completed'] })
  status: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  ownerNotes?: string;

  @Prop()
  applicationDate: Date;

  @Prop()
  responseDate?: Date;

  @Prop()
  completionDate?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const AdoptionSchema = SchemaFactory.createForClass(Adoption); 