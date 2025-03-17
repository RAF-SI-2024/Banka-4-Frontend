import { Gender } from '@/types/gender';
import { Privilege } from '@/types/privileges';

export interface ClientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  privileges: Privilege[];
  has2FA: boolean;

  // TODO(marko): add accounts field
}

export interface PaymentResponseDto {
  id: string;
  orderNumber: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  recipient: string;
  paymentCode: string;
  referenceNumber: string;
  paymentPurpose: string;
  paymentDateTime: string;
  status: string;
}

export interface ClientContactResponseDto {
  id: string;
  nickname: string;
  accountNumber: string;
}
