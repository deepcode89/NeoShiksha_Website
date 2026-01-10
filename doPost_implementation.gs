function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('MASTER_DATA');

    // Define the approved headers in their correct order
    var approvedHeaders = [
      'Timestamp', 'Source', 'User_Type', 'Name', 'Phone', 'City', 'Zone', 'Locality', 'Pincode',
      'Gender_Info', 'Qualification', 'Experience', 'Subject', 'Class', 'Board', 'Status', 'Full_JSON_Data'
    ];

    // Create sheet with approved headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet('MASTER_DATA');
      sheet.appendRow(approvedHeaders);
    }

    // Parse incoming payload
    var requestBody = e.postData.contents;
    var data = JSON.parse(requestBody);

    // Read headers dynamically from row 1 (case-sensitive)
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerMap = {}; // Maps header name to column index (0-based)
    for (var i = 0; i < headerRow.length; i++) {
      headerMap[headerRow[i]] = i;
    }

    // Create new row array with same length as current headers
    var newRow = new Array(headerRow.length);

    // Helper: Set value in row by header name (case-sensitive, exact match)
    function setRowValueByHeader(headerName, value) {
      if (headerName in headerMap) {
        newRow[headerMap[headerName]] = value || '';
      }
    }

    // ========== SERVER-SIDE TIMESTAMP ==========
    setRowValueByHeader('Timestamp', new Date());

    // ========== SOURCE ==========
    setRowValueByHeader('Source', data.source || 'Web');

    // ========== USER_TYPE NORMALIZATION (CRITICAL BUSINESS RULE) ==========
    // If form_type is "CallbackForm", override user_type with Callback_Parent or Callback_Teacher
    var userType = data.user_type || '';
    if (data.form_type === 'CallbackForm' && data.callbackUserType) {
      if (data.callbackUserType === 'Parent') {
        userType = 'Callback_Parent';
      } else if (data.callbackUserType === 'Teacher') {
        userType = 'Callback_Teacher';
      }
    }
    setRowValueByHeader('User_Type', userType);

    // ========== NAME NORMALIZATION ==========
    // Try multiple sources in order of priority
    var finalName = data.name || data.teacherName || data.parentName || '';
    setRowValueByHeader('Name', finalName);

    // ========== FIELD MAPPINGS (payload field → sheet header) ==========
    // Maps single-value fields only; arrays are left blank and stored in Full_JSON_Data
    var fieldMappings = {
      'phone': 'Phone',
      'city': 'City',
      'zone': 'Zone',
      'locality': 'Locality',
      'pincode': 'Pincode',
      'gender': 'Gender_Info',
      'qualification': 'Qualification',
      'experience': 'Experience',
      'board': 'Board',
      'class': 'Class'
    };

    // Apply field mappings (case-sensitive)
    for (var payloadField in fieldMappings) {
      if (payloadField in data) {
        var headerName = fieldMappings[payloadField];
        var value = data[payloadField];
        
        // Skip arrays; they are included in Full_JSON_Data only
        // (Arrays like 'subjects', 'classes', 'boards' from frontend are NOT mapped to individual columns)
        if (Array.isArray(value)) {
          continue;
        }
        
        setRowValueByHeader(headerName, value);
      }
    }

    // ========== STATUS (SERVER-SIDE DEFAULT) ==========
    setRowValueByHeader('Status', 'New');

    // ========== FULL_JSON_DATA (COMPLETE RAW PAYLOAD) ==========
    // Stores entire payload as stringified JSON, including arrays, metadata, and all fields
    setRowValueByHeader('Full_JSON_Data', JSON.stringify(data));

    // Append the row to the sheet
    sheet.appendRow(newRow);
    SpreadsheetApp.flush();
    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
