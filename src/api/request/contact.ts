export interface NewContactRequest {
  fullName: string;
  accountNumber: string;
}

export type EditContactRequest = Partial<NewContactRequest>;
