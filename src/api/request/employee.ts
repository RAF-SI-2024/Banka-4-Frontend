export interface NewEmployeeRequest {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  privilege: string[];
  position: string;
  department: string;
  // TODO(marko): add active once backend implements it
}
