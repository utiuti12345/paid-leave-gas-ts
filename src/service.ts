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
  var paramater = getParameter(e.parameter);

  var employeeInfo = new EmployeeInfo(paramater.employeeName,getSpreadId(paramater.employeeName),getMailAddressByEmployeeSheet(paramater.employeeName));
  var approver = new ApproveInfo(paramater.employeeName,getMailAddressByApproveSheet(paramater.employeeName));

  var paidLeaveList = "";
  for(var i=0;i<paramater.dates.length;i++){
    var paidLeaveDate = new PaidLeaveDate(paramater.dates[i]);
    if(!(paidLeaveDate.isHoliday() || paidLeaveDate.isWeekend())){
      paidLeaveList += paidLeaveDate.formatDate() + " "
      updatePaidTimeSheet(getSpreadId(paramater.employeeName),paidLeaveDate.getYear(),paidLeaveDate.getDate());
    }
  }

  let now = new Date();
  
  var aprroveBodies = generateAprroveBodies(paramater.employeeName,paidLeaveList);
  sendMail(getMailAddressByApproveSheet(paramater.employeeName),subject,aprroveBodies.plain,aprroveBodies.html);

  var applicantBodies = generateApplicantBodies(paramater.employeeName,paidLeaveList,getBalancePaidLeave(getSpreadId(paramater.employeeName),now),getSpreadId(paramater.employeeName));
  sendMail(getMailAddressByEmployeeSheet(paramater.employeeName),subject,applicantBodies.plain,applicantBodies.html);
  
  return HtmlService.createHtmlOutput("完了しました。メールを確認してください。");
}