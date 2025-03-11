export interface NewContactRequest {
  nickname: string;
  accountNumber: string;
}

export type EditContactRequest = Partial<NewContactRequest>;
