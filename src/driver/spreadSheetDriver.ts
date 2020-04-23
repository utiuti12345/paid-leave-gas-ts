import SpreadSheetDriver, { EmployeesJson } from "../interface/driver/spreadSheetDriver";

export class SpreadSheetDriverImpl implements SpreadSheetDriver {
  private id;
  private sheetName
  constructor(_id,_sheetName){
  }
  
  async findAll(): Promise<EmployeesJson>{
    return await SpreadSheetsSQL.open(this.id, this.sheetName).select(['id', 'employee_name', 'spread_id', 'mail_address','join_date']).result();
  }
}