import { Employee } from "../domain/employee";
import { EmployeeUseCase } from "../interface/useCase/employeeUseCase";
import EmployeeRepository from "../interface/repository/employeeRepository";

export class EmployeeUseCaseImpl implements EmployeeUseCase {
  readonly employeeRepository:EmployeeRepository;

  constructor(repository: EmployeeRepository) {
    this.employeeRepository = repository;
  }

  async fetchEmployees():Promise<Employee[]>{
    return await this.employeeRepository.findAll();
  }
}