import { Axios } from 'axios';
import { NewLoanRequest } from '@/api/request/loan';
import { LoanRequestResponseDto } from '@/api/response/loan';

/**
 * Sends a new loan request to the backend (POST /loans).
 * Uses the NewLoanRequest DTO for the request body.
 */
export const requestLoan = async (client: Axios, data: NewLoanRequest) =>
  client.post<LoanRequestResponseDto>('/loans', data);
