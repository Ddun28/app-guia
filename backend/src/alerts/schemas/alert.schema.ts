import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

export enum AlertType {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info'
}

@Schema({ timestamps: true })
export class Alert {
  @Prop({
    type: String,
    enum: AlertType,
    default: AlertType.INFO
  })
  type: AlertType;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);