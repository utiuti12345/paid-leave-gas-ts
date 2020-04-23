import { Util } from './util';
import { Util } from './util';

function doGet(request) {
  const template = 'index';
  const htmlOutput = HtmlService.createTemplateFromFile(template).evaluate();
  htmlOutput
    .setTitle('有給休暇申請')
    //.setFaviconUrl('https://drive.google.com/uc?id=1jDk8h0egYxfKbTTX0YNs-cTHd93Xi68O&.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  return htmlOutput;
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doPost(e){
  var paramater = Util.getParameter(e.parameter);

  var employeeInfo = new EmployeeInfo(paramater.employeeName,Util.getSpreadId(paramater.employeeName),Util.getMailAddressByEmployeeSheet(paramater.employeeName));
  var approver = new ApproveInfo(paramater.employeeName,Util.getMailAddressByApproveSheet(paramater.employeeName));
  
  var paidLeaveList = "";
  for(var i=0;i<paramater.dates.length;i++){
    var paidLeaveDate = new PaidLeaveDate(paramater.dates[i]);
    if(!(paidLeaveDate.isHoliday() || paidLeaveDate.isWeekend())){
      paidLeaveList += paidLeaveDate.formatDate() + " "
      Util.updatePaidTimeSheet(employeeInfo.getSpreadId(),paidLeaveDate.getDate());
    }
  }

  let now = new Date();
  let nowDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDay(); 
  
  var aprroveBodies = Util.generateAprroveBodies(employeeInfo.getEmployeeName(),paidLeaveList);
  Util.sendMail(approver.getMailAddress(),subject,aprroveBodies.plain,aprroveBodies.html);

  var applicantBodies = Util.generateApplicantBodies(employeeInfo.getEmployeeName(),paidLeaveList,Util.getBalancePaidLeave(employeeInfo.getSpreadId(),nowDate),employeeInfo.getSpreadId());
  Util.sendMail(employeeInfo.getMailAddress(),subject,applicantBodies.plain,applicantBodies.html);
  
  return HtmlService.createHtmlOutput("完了しました。メールを確認してください。");
}