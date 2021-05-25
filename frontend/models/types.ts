export interface EmployeeModel {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  company_name: string;
}

export interface EmployerModel {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  latitude: Number;
  longitude: Number;
  company_name: string;
}

export interface UserModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  latitude: Number;
  longitude: Number;
  is_employer: boolean;
  is_employee: boolean;
}

export interface registerUser {
  address1: string;
  address2: string;
  city: string;
  company_name: string;
  country: string;
  email: string;
  first_name: string;
  last_name: string;
  latitude: string;
  longitude: string;
  password1: string;
  password2: string;
  type: string;
  username: string;
}
