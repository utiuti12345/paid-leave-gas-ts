import EmployeeRepository from "../interface/repository/employeeRepository";
import SpreadSheetDriver from "../interface/driver/spreadSheetDriver";
import { Employee } from "../domain/employee";

export class EmployeeRepositoryImpl implements EmployeeRepository {
  private readonly spreadSheetDriver: SpreadSheetDriver;

  constructor(_spreadSheetDriver:SpreadSheetDriver){
    this.spreadSheetDriver = _spreadSheetDriver
  }

  async findAll(): Promise<Employee[]> {
    const res = await this.spreadSheetDriver.findAll();
    var ret = [];
    res.employees.map(
      employeeEntity => {
        ret.push(
        new Employee(
          employeeEntity.id,
          employeeEntity.employee_name,
          employeeEntity.spread_id,
          employeeEntity.mail_address,
          employeeEntity.join_date
        ))
      }
    );
    return ret;
  }
}