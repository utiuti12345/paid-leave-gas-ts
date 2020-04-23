export default interface SpreadSheetDriver {
  findAll(): Promise<EmployeesJson>;
}

export type EmployeesJson = {
  employees: EmployeeJson[];
};

export type EmployeeJson = {
  id: string;
  employee_name: string;
  spread_id:string;
  mail_address: string;
  join_date: string;
};
