export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface DecodedToken extends AuthPayload {
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export interface TransactionPayload {
  senderId: string;
  receiverId?: string;
  walletId: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  verified: boolean;
  kycStatus: string;
  accountStatus: string;
  role: string;
}
