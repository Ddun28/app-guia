import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlaceDocument = Place & Document;

export enum PlaceType {
  RESTAURANT = 'restaurant',
  CAFE = 'cafe',
  PARK = 'park',
  MUSEUM = 'museum',
  TRANSPORT = 'transport'
}

@Schema({ timestamps: true })
export class Place {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: PlaceType,
    required: true
  })
  type: PlaceType;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);