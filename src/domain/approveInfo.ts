// 承認者
class ApproveInfo{
  private employeeName: string;
  private mailAddress: string;

  constructor(private _employeeName:string, private _mailAddress:string){
  }

  public getEmployeeName(){
    return this.employeeName
  }

  public getMailAddress(){
    return this.mailAddress
  }
}

// 承認者テスト
function approveInfoTest(){
  var e = new ApproveInfo("社員1","アドレス1");
  console.log(e.getEmployeeName());
  console.log(e.getMailAddress());
}
