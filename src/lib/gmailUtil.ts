export class GmailUtil{
  // メール送信
  static sendMail(mailAddress,subject,plainBody,htmlBody){
    GmailApp.sendEmail(mailAddress, subject, plainBody,{ htmlBody:htmlBody });
  }
}