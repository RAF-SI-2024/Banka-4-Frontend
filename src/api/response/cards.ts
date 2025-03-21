import { Pageable } from '@/types/pageable';
import { CardName, CardStatus, CardType } from '@/types/card';
import { ClientResponseDto } from '@/api/response/client';
import { AuthorizedUserDto } from '@/api/request/authorized-user';

export interface CardResponseDto {
  cardNumber: string;
  cvv: string;
  cardName: CardName;
  creationDate: string;
  expirationDate: string;
  cardType: CardType;
  limit: number;
  cardStatus: CardStatus;
  accountNumber: string;
  client: ClientResponseDto;
  authorizedUserDto?: AuthorizedUserDto;
}

export type EmployeeCardResponseDto = Pageable<CardResponseDto>;
export type CardsResponseDto = Pageable<CardResponseDto>;
