export class UserResponseLoginDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  role: {
    name: string;
    description?: string;
  };
}
