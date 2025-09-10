import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route {
  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ type: Object }) 
  path: any;

  @Prop({ required: true, type: Number })
  duration: number; 

  @Prop({ required: true, type: Number })
  distance: number; 

  @Prop({ default: true })
  isSafe: boolean;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  safetyScore: number; 
}

export const RouteSchema = SchemaFactory.createForClass(Route);