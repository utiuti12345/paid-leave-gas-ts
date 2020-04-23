import { SpreadUtil } from './lib/SpreadUtil';
import { GmailUtil } from './lib/gmailUtil';

export class Util{
  // 送信する本文の作成
  static generateAprroveBodies(employeeName,paidDateTime){
    var plain = '';
    plain += '有給休暇申請がありました。\n\n';
    plain += '・社員名: ' + employeeName + '\n';
    plain += '・取得日時: ' + paidDateTime + '\n';
  
    var html = '';
    html += '<h1>有給休暇申請のお知らせ</h1>';
    html += '<p>有給休暇申請がありました。</p>';
    html += '<ul>';
    html += '<li>社員名: ' + employeeName + '</li>';
    html += '<li>取得日時: ' + paidDateTime + '</li>';
    html += '</ul>';
    
    return {
      plain: plain,
      html: html
    };
  }

  // 送信する本文の作成
  static generateApplicantBodies(employeeName,paidDateTime,balancePaidLeave,spreadId){
    var plain = '';
    plain += '有給休暇申請がありました。\n\n';
    plain += '・社員名: ' + employeeName + '\n';
    plain += '・取得日時: ' + paidDateTime + '\n';
    plain += '・残り有給日数: ' +  balancePaidLeave + '\n';
    plain += '・有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '\n';
  
    var html = '';
    html += '<h1>有給休暇申請のお知らせ</h1>';
    html += '<p>有給休暇申請がありました。</p>';
    html += '<ul>';
    html += '<li>社員名: ' + employeeName + '</li>';
    html += '<li>取得日時: ' + paidDateTime + '</li>';
    html += '<li>残り有給日数: ' +  balancePaidLeave + '</li>';
    html += '<li>有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '</li>';
    html += '</ul>';
    
    return {
      plain: plain,
      html: html
    };
  }

  // メール送信
  static sendMail(mailAddress,subject,plainBody,htmlBody){
    GmailUtil.sendMail(mailAddress, subject, plainBody,htmlBody);
  }

  // パラメーター取得
  static getParameter(parameter){
    var employeeName = parameter.employee_name;
    var approveName = parameter.approve_name;
    var dates = [];
    if(parameter.start_date === "" && parameter.end_date === ""){
      for(var i=1;;i++){
        if(parameter['date'+i] === undefined){
          break;
        }
        else if(parameter['date'+i] === ''){
          continue;
        }
        dates.push(parameter['date'+i]);
      }
    }
    else{
      var endDate = new Date(parameter.end_date);
      dates.push(parameter.start_date);
      for(var i=1;;i++){
        var tommorow = new Date(parameter.start_date);
        tommorow.setDate(tommorow.getDate() + i);
        dates.push(tommorow.toString());
        if(tommorow.getTime() === endDate. getTime()){
          break;
        }
      }
    }
    
    return {
      employeeName: employeeName,
      dates: dates,
      approveName: approveName
    };
  }


  // 有給休暇シートの繰越分,本年度を更新
  static updatePaidLeave(spreadId,currentBalancePaidLeave,paidLeave,employeeName,year){
    var date = new Date();
    let sheet = SpreadUtil.getSheet(spreadId,year);
    // 繰越分
    sheet.getRange(6, 8).setValue(currentBalancePaidLeave);
    // 本年度
    sheet.getRange(6, 10).setValue(paidLeave);
    // タイトル修正
    sheet.getRange(2,2).setValue(date.getFullYear() + "年度 有給休暇管理表");
    // 名前修正
    sheet.getRange(6,5).setValue(employeeName);
  }

  // 有給休暇シートから残日数の取得
  static getBalancePaidLeave(spreadId,paidDateTime){
    var date = new Date(paidDateTime);
    var sheet = SpreadUtil.getSheet(spreadId,date.getFullYear());
    return sheet.getRange(6, 14).getValue();
  }

  static getBalancePaidLeaveTest(){
    let now = new Date();
    let nowDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDay(); 
    var bpl = this.getBalancePaidLeave("12KoRX6_okouXy_KOaSQ9qB-BsjHEPLbCYl79PKrcqmY",nowDate);
    console.log(bpl);
  }

  // 有給休暇シートの更新
  static updatePaidTimeSheet(spreadId,paidDateTime){
    var date = new Date(paidDateTime);
    var sheet = SpreadUtil.getSheet(spreadId,date.getFullYear());
    var row = SpreadUtil.findRow(sheet,(date.getMonth()+1) + "月",2);
    var col = SpreadUtil.findColumn(sheet,date.getDate(),8);
    sheet.getRange(row, col).setValue(paidStatus().digestion);
  }

  // 社員シートから名前取得
  static getEmployeeNames(){
    var sheet = SpreadUtil.getSheet(masterSpreadSheetId,employeeListSheet);
    var lastRow = sheet.getDataRange().getLastRow();
    var names = [];
    for(var i = 2; i < lastRow + 1; i++){
      names.push(sheet.getRange(i, 2).getValue())
    }
    return names;
  }

  static getTest(){
    let employeeList = this.getEmployeeNames();
    let approveList = this.getApproveNames();
  }

  // 承認者シートから名前取得
  static getApproveNames(){
    var sheet = SpreadUtil.getSheet(masterSpreadSheetId,approveList);
    var lastRow = sheet.getDataRange().getLastRow();
    var names = [];
    for(var i = 2; i < lastRow + 1; i++){
      names.push(sheet.getRange(i, 2).getValue())
    }
    return names;
  }

  // 社員シートからメールアドレス取得
  static getMailAddressByEmployeeSheet(name){
    var sheet = SpreadUtil.getSheet(masterSpreadSheetId,employeeListSheet);
    var row = SpreadUtil.findRow(sheet,name,2);
    var col = SpreadUtil.findColumn(sheet,'メールアドレス',1);
    return sheet.getRange(row, col).getValue();
  }

  // 社員シートから入社日取得
  static getJoinsCompanyByEmployeeSheet(name){
    var sheet = SpreadUtil.getSheet(masterSpreadSheetId,employeeListSheet);
    var row = SpreadUtil.findRow(sheet,name,2);
    var col = SpreadUtil.findColumn(sheet,'入社日',1);
    return sheet.getRange(row, col).getValue();
  }

  // 今年の有給日数を取得
  static getPaidLeave(joiningDate){
    let jd = new Date(joiningDate);
    let now = new Date();
    let ms = now.getTime() - jd.getTime();
    let lengthService = Math.floor(ms / (1000*60*60*24*30.417));
    
    if(lengthService > 0 && lengthService < 6){
      return 0;
    }else if(lengthService > 6 && lengthService < 18){
      return 10;
    }else if(lengthService > 18 && lengthService < 30){
      return 11;
    }else if(lengthService > 30 && lengthService < 42){
      return 12;
    }else if(lengthService > 42 && lengthService < 54){
      return 14;
    }else if(lengthService > 54 && lengthService < 66){
      return 16;
    }else if(lengthService > 66 && lengthService < 78){
      return 18;
    }else{
      return 20;
    }
    
  //  switch(lengthService) {
  //      case 6 : return 10;
  //      case 18 : return 11;
  //      case 30 : return 12;
  //      case 42 : return 14;
  //      case 54 : return 16;
  //      case 66 : return 18;
  //      case 78 : return 20;
  //  }
  }

  // 承認者シートからメールアドレス取得
  static getMailAddressByApproveSheet(name){
    var sheet = SpreadUtil.getSheet(masterSpreadSheetId,approveList);
    var row = SpreadUtil.findRow(sheet,name,2);
    var col = SpreadUtil.findColumn(sheet,'メールアドレス',1);
    return sheet.getRange(row, col).getValue();
  }

  static getMailAddressByApproveSheetTest(){
    let name = this.getMailAddressByApproveSheet("社員1");
    let spreadId = this.getSpreadId("社員1");
    console.log(name + spreadId);
  }

  // スプレッドシートID取得
  static getSpreadId(name){
    var sheet = SpreadUtil.getSheet(masterSpreadSheetId,employeeListSheet);
    var row = SpreadUtil.findRow(sheet,name,2);
    var col = SpreadUtil.findColumn(sheet,'スプレッドシートID',1);
    return sheet.getRange(row, col).getValue();
  }

  static test(){
    let joiningDate = this.getJoinsCompanyByEmployeeSheet("社員3");
    let paidLeave = this.getPaidLeave(joiningDate);
    console.log(paidLeave);
  }

  static sample(){
    console.log("sample");
    return "sample";
  }
}

// 固定値
const subject = "有給休暇申請";
const templateSpreadSheetId = "1zZW-gTaDx6p52jekh5Km5YVdXrxFJ9wEjsKK-E-ym8g";
const masterSpreadSheetId = "1qc1AZf7aFBbgbmddNi5jF2wcvdHNxNwxg3jMuJLyQj0";
const approveList = "approve_list";
const employeeListSheet = "employee_list";

// 有給ステータス
function paidStatus(){
  return {
    plans:"■　予定",
    digestion:"○　消化"
  };
}