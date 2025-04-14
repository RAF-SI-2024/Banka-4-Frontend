import { EmployeeResponseDto } from '@/api/response/employee';
import { ActuaryInfoDto } from '@/api/response/actuaries';

export interface ActuaryItem {
  user: EmployeeResponseDto;
  actuary: ActuaryInfoDto;
}
