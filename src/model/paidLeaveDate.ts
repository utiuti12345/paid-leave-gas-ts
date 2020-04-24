class PaidLeaveDate{
  private date: Date

  constructor(private _date:string){
    this.date = new Date(_date)
  }

  public isHoliday():boolean{
    const calendars = CalendarApp.getCalendarsByName('日本の祝日');
    const count = calendars[0].getEventsForDay(this.date).length;
    return count === 1;
  }

  public isWeekend():boolean{
    return (this.date.getDay() === 0) || (this.date.getDay() === 6);
  }

  public getYear():string {
    const month = (this.date.getMonth() + 1);
    // 1月 2月 3月 は 年を跨いでいるので、引く
    if((month === 1) || (month === 2) || (month === 3)){
      const year = this.date.getFullYear() - 1;
      return year.toString();
    }
    return this.date.getFullYear().toString();
  }

  public formatDate():string{
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    return year + "-" + month + "-" + day;
  }

  public getDate(){
    return this.date;
  }
}

// 平日テスト
function weekdayTest(){
  var paidLeaveDate = new PaidLeaveDate("2020/4/13");
  console.log(paidLeaveDate.isHoliday());
  console.log(paidLeaveDate.isWeekend());
  console.log(paidLeaveDate.getDate());
}

// 日曜テスト
function sundayTest(){
  var paidLeaveDate = new PaidLeaveDate("2020/4/12");
  console.log(paidLeaveDate.isHoliday());
  console.log(paidLeaveDate.isWeekend());
  console.log(paidLeaveDate.getDate());
}

// 祝日テスト
function holidayTest(){
  var paidLeaveDate = new PaidLeaveDate("2020/4/29");
  console.log(paidLeaveDate.isHoliday());
  console.log(paidLeaveDate.isWeekend());
  console.log(paidLeaveDate.getDate());
}