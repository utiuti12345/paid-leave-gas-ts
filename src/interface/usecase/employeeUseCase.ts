import { Employee } from "../../domain/employee";

export interface EmployeeUseCase {
  fetchEmployees(): Promise<Employee[]>;
}