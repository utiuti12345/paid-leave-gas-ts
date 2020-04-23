import { Employee } from "../../domain/employee";

export default interface EmployeeRepository {
  findAll(): Promise<Employee[]>;
}