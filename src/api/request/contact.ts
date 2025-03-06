export interface NewContactRequest {
  name: string;
  accountNumber: string;
}

export type EditContactRequest = Partial<NewContactRequest>;
