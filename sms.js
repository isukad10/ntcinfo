function onFormSubmit(e) {
  try {
    var timestamp = e.values[0];
    var phone = e.values[1];
    var name = e.values[2];
    var vehicleNo = e.values[4];

    var formattedPhone = phone.replace(/^0/, "94");

    // Get SMS_Log sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SMS_Log");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("SMS_Log");
      sheet.appendRow([
        "ID",
        "Timestamp",
        "Phone",
        "Name",
        "VehicleNo",
        "Message",
        "Status",
        "Response",
      ]);
    }

    // Generate auto-increment ID with prefix
    var nextIdNumber = sheet.getLastRow();
    var prefix = "REG";
    var customId = prefix + "-" + ("000" + nextIdNumber).slice(-4);

    var message =
      "Registration Successful ✅\n" +
      "ID: " +
      customId +
      "\n" +
      "Name: " +
      name +
      "\n" +
      "Vehicle No: " +
      vehicleNo +
      "\n";

    var url =
      "https://msmsenterpriseapi.mobitel.lk/EnterpriseSMSV3/esmsproxy_multilang.php";

    var params = {
      m: message,
      r: formattedPhone,
      a: "NTC",
      u: "esmsusr_1q7q",
      p: "SmsGps23@#",
      t: 0,
    };

    // Send request
    var response = UrlFetchApp.fetch(url + "?" + toQueryString(params), {
      method: "get",
      muteHttpExceptions: true,
    });

    // Log details in SMS_Log sheet
    sheet.appendRow([
      customId,
      new Date(),
      phone,
      name,
      nic,
      vehicleNo,
      message,
      "Sent",
      response.getContentText(),
    ]);
  } catch (error) {
    Logger.log("Error sending SMS: " + error);
  }
}

// Helper to convert object to query string
function toQueryString(params) {
  return Object.keys(params)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
}
