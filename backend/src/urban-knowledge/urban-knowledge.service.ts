import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from '../alerts/schemas/alert.schema';
import { Place, PlaceDocument } from '../places/schemas/place.schema';
import { Route, RouteDocument } from '../routes/schemas/route.schema';
import { CreateAlertDto } from '../alerts/dto/create-alert.dto';
import { CreatePlaceDto } from '../places/dto/create-place.dto';
import { 
  UserProfile, 
  USER_PROFILE_MODEL  
} from 'src/user/user-profiles/schemas/user-profile.schema';
import axios from 'axios';

@Injectable()
export class UrbanKnowledgeService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(USER_PROFILE_MODEL) private userProfileModel: Model<UserProfile>,
  ) {}

  async getAlerts(user: any, lat?: number, lng?: number): Promise<Alert[]> {
    let userLat = lat;
    let userLng = lng;
    
    if (!lat || !lng) {
      const userLocation = await this.getUserLocation(user._id || user.userId);
      if (userLocation) {
        userLat = userLocation.lat;
        userLng = userLocation.lng;
      }
    }

    return this.alertModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  async createAlert(user: any, createAlertDto: CreateAlertDto): Promise<Alert> {
    let finalLat = createAlertDto.latitude;
    let finalLng = createAlertDto.longitude;
    
    if (!finalLat || !finalLng) {
      const userLocation = await this.getUserLocation(user._id || user.userId);
      if (userLocation) {
        finalLat = userLocation.lat;
        finalLng = userLocation.lng;
      }
    }

    const alertData = {
      ...createAlertDto,
      latitude: finalLat,
      longitude: finalLng,
      userId: user._id || user.userId,
    };

    const createdAlert = new this.alertModel(alertData);
    return createdAlert.save();
  }

  async getPlaces(user: any, type: string, lat?: number, lng?: number): Promise<Place[]> {
    let userLat = lat;
    let userLng = lng;
    
    if (!lat || !lng) {
      const userLocation = await this.getUserLocation(user._id || user.userId);
      if (userLocation) {
        userLat = userLocation.lat;
        userLng = userLocation.lng;
      }
    }

    const query: any = { isActive: true };
    
    if (type && type !== 'all') {
      query.type = type;
    }

    return this.placeModel
      .find(query)
      .sort({ rating: -1 })
      .exec();
  }

  async createPlace(user: any, createPlaceDto: CreatePlaceDto): Promise<Place> {
    const createdPlace = new this.placeModel(createPlaceDto);
    return createdPlace.save();
  }

  async getSafeRoutes(user: any, destination: string, origin?: string): Promise<Route[]> {
    let userOrigin = origin;
    
    if (!origin) {
      const userProfile = await this.findUserProfileByUserId(user._id || user.userId);
      if (userProfile?.ubicacion?.ciudad) {
        userOrigin = userProfile.ubicacion.ciudad;
      }
    }

    return this.routeModel
      .find({ 
        origin: userOrigin, 
        destination, 
        isSafe: true 
      })
      .sort({ safetyScore: -1 })
      .exec();
  }

  private async findUserProfileByUserId(userId: string): Promise<UserProfile | null> {
    try {
      return await this.userProfileModel
        .findOne({ user_id: userId })
        .exec();
    } catch (error) {
      console.error('Error obteniendo perfil de usuario:', error);
      return null;
    }
  }

  private async getUserLocation(userId: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const userProfile = await this.findUserProfileByUserId(userId);
      
      if (userProfile?.ubicacion?.ciudad) {
        const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
          'madrid': { lat: 40.4168, lng: -3.7038 },
          'barcelona': { lat: 41.3851, lng: 2.1734 },
          'valencia': { lat: 39.4699, lng: -0.3763 },
          'sevilla': { lat: 37.3891, lng: -5.9845 },
        };

        const cityKey = userProfile.ubicacion.ciudad.toLowerCase();
        return cityCoordinates[cityKey] || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo ubicación del usuario:', error);
      return null;
    }
  }

  private getTranslationDictionary(): { [key: string]: string } {
    return {
      'Park': 'Parque',
      'Square': 'Plaza',
      'Street': 'Calle',
      'Avenue': 'Avenida',
      'Bridge': 'Puente',
      'Church': 'Iglesia',
      'Cathedral': 'Catedral',
      'Museum': 'Museo',
      'Theater': 'Teatro',
      'Library': 'Biblioteca',
      'Hospital': 'Hospital',
      'School': 'Escuela',
      'University': 'Universidad',
      'Station': 'Estación',
      'Airport': 'Aeropuerto',
      'Market': 'Mercado',
      'Mall': 'Centro Comercial',
      'Restaurant': 'Restaurante',
      'Cafe': 'Cafetería',
      'Hotel': 'Hotel',
      'Beach': 'Playa',
      'Mountain': 'Montaña',
      'Lake': 'Lago',
      'River': 'Río',
      'Forest': 'Bosque',
      'Garden': 'Jardín',
      'Castle': 'Castillo',
      'Palace': 'Palacio',
      'Monument': 'Monumento',
      'Tower': 'Torre',
      'Fountain': 'Fuente',
      'Attraction': 'Atracción',
      'Tourist': 'Turístico',
      'Historic': 'Histórico',
      'Cultural': 'Cultural',
      'Natural': 'Natural',
      'Viewpoint': 'Mirador',
      'Trail': 'Sendero',
      'Path': 'Camino'
    };
  }

  private translateWithDictionary(text: string): string {
    const dictionary = this.getTranslationDictionary();
    let translated = text;
    
    Object.entries(dictionary).forEach(([english, spanish]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translated = translated.replace(regex, spanish);
    });
    
    return translated;
  }

  /**
   * Obtiene código de país para filtrar mejor
   */
  private getCountryCode(countryName: string): string {
    const countryCodes: { [key: string]: string } = {
      'venezuela': 've',
      'bolivia': 'bo',
      'spain': 'es',
      'españa': 'es',
      'mexico': 'mx',
      'méxico': 'mx',
      'argentina': 'ar',
      'colombia': 'co',
      'chile': 'cl',
      'peru': 'pe',
      'perú': 'pe',
      'ecuador': 'ec',
      'uruguay': 'uy',
      'paraguay': 'py',
      'brasil': 'br',
      'brazil': 'br',
      'estados unidos': 'us',
      'united states': 'us',
      'canada': 'ca',
      'francia': 'fr',
      'france': 'fr',
      'italia': 'it',
      'italy': 'it',
      'alemania': 'de',
      'germany': 'de'
    };
    
    return countryCodes[countryName.toLowerCase()] || '';
  }

  /**
   * Filtro más robusto por ubicación
   */
  private filterByLocation(places: any[], ciudad: string, pais: string): any[] {
    const targetCountry = pais.toLowerCase();
    const targetCity = ciudad.toLowerCase();
    
    return places.filter(place => {
      const placeCountry = place.address?.country?.toLowerCase();
      const placeCountryCode = place.address?.country_code?.toLowerCase();
      const placeCity = place.address?.city?.toLowerCase() || 
                       place.address?.town?.toLowerCase() ||
                       place.address?.municipality?.toLowerCase();
      
      // Verificar país
      const countryMatch = placeCountry === targetCountry || 
                          placeCountryCode === this.getCountryCode(targetCountry);
      
      // Verificar ciudad (si está disponible en los datos)
      const cityMatch = !placeCity || placeCity.includes(targetCity) || 
                       targetCity.includes(placeCity);
      
      return countryMatch && cityMatch;
    });
  }

  async getRecommendedPlacesOSM(ciudad: string, pais: string, tipo?: string): Promise<any[]> {
    try {
      const query = tipo ? `${tipo} in ${ciudad}, ${pais}` : `attractions in ${ciudad}, ${pais}`;
      const url = `https://nominatim.openstreetmap.org/search`;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const countryCode = this.getCountryCode(pais);
      
      const response = await axios.get(url, {
        params: {
          'q': query,
          'format': 'json',
          'limit': 20,
          'addressdetails': 1,
          'countrycodes': countryCode 
        },
        headers: {
          'User-Agent': 'AppGuiaUrbana/1.0 (danieldum28@gmail.com)',
          'Accept-Language': 'es'
        }
      });

      // Doble filtro por seguridad
      const filteredResults = this.filterByLocation(response.data, ciudad, pais);
      
      return this.mapOSMResponse(filteredResults.slice(0, 10));
        
    } catch (error) {
      console.error('Error con OpenStreetMap:', error.message);
      return [];
    }
  }

  private mapOSMResponse(osmData: any[]): any[] {
    return osmData.map(place => ({
      fsq_id: place.place_id,
      name: this.cleanPlaceName(place.display_name),
      location: {
        formatted_address: this.cleanAddress(place.display_name),
        locality: place.address?.city || place.address?.town || place.address?.municipality,
        country: place.address?.country,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      },
      categories: [{ 
        name: this.translateWithDictionary(place.type || place.class || 'point_of_interest')
      }]
    }));
  }

  private cleanPlaceName(displayName: string): string {
    const parts = displayName.split(',');
    return parts[0].trim();
  }

  private cleanAddress(displayName: string): string {
    const parts = displayName.split(',');
    return parts.slice(0, 3).join(', ').trim();
  }
}