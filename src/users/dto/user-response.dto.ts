export class PetInUserDto {
  name: string;
  species: string;
  breed?: string;
  size: string;
  age: number;
  gender: string;
  description: string;
  status: string;
  vaccinations: string[];
  isNeutered: boolean;
  location: string;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  pets: PetInUserDto[];
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 