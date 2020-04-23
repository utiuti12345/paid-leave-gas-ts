export class Employee {
  private id:string
  private employeeName:string
  private spreadId:string
  private mailAddress:string
  private joinDate:string
  
  constructor(id:string,_employeeName:string,_spreadId:string,_mailAddress:string,_joinDate:string){
  }

  public getEmployeeName(){
    return this.employeeName
  }
  public getSpreadId(){
    return this.spreadId
  }
  public getMailAddress(){
    return this.mailAddress
  }
}


// // 社員情報
// function employeeInfoTest(){
//   var e = new EmployeeInfo("社員1","スプレッドシート1","test");
//   console.log(e.getEmployeeName());
//   console.log(e.getSpreadId());
//   console.log(e.getMailAddress());
// }