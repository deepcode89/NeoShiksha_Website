function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(10000);

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('MASTER_DATA');

    var approvedHeaders = [
      'Timestamp',
      'Source',
      'User_Type',
      'Name',
      'Phone',
      'City',
      'Zone',
      'Locality',
      'Pincode',
      'Gender_Info',
      'Qualification',
      'Experience',
      'Subject',
      'Class',
      'Board',
      'Mode',
      'Status',
      'Full_JSON_Data'
    ];

    if (!sheet) {
      sheet = doc.insertSheet('MASTER_DATA');
      sheet.appendRow(approvedHeaders);
    }

    var data = JSON.parse(e.postData.contents);

    var headerRow = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    var headerMap = {};
    headerRow.forEach(function (h, i) {
      headerMap[h] = i;
    });

    var newRow = new Array(headerRow.length);

    function setVal(header, value) {
      if (header in headerMap) {
        newRow[headerMap[header]] =
          value !== undefined && value !== null ? value : '';
      }
    }

    /* ================= CORE FIELDS ================= */

    setVal('Timestamp', new Date());
    setVal('Source', data.source || 'Web');

    var userType = data.user_type || '';
    if (data.form_type === 'CallbackForm' && data.callbackUserType) {
      userType =
        data.callbackUserType === 'Parent'
          ? 'Callback_Parent'
          : 'Callback_Teacher';
    }
    setVal('User_Type', userType);

    setVal(
      'Name',
      data.name || data.teacherName || data.parentName || ''
    );

    /* ================= SIMPLE FIELD MAPPING ================= */

    var fieldMap = {
      phone: 'Phone',
      city: 'City',
      zone: 'Zone',
      locality: 'Locality',
      pincode: 'Pincode',
      gender: 'Gender_Info',
      qualification: 'Qualification',
      experience: 'Experience',
      mode: 'Mode'
    };

    for (var key in fieldMap) {
      if (key in data && !Array.isArray(data[key])) {
        setVal(fieldMap[key], data[key]);
      }
    }

    /* ================= DISPLAY LAYER (COMMA STRINGS) ================= */

    // SUBJECT
    if (Array.isArray(data.subjects) && data.subjects.length > 0) {
      setVal('Subject', data.subjects.join(', '));
    } else if (typeof data.subjects === 'string') {
      setVal('Subject', data.subjects);
    }

    // BOARD
    if (Array.isArray(data.boards) && data.boards.length > 0) {
      setVal('Board', data.boards.join(', '));
    } else if (typeof data.boards === 'string') {
      setVal('Board', data.boards);
    } else if (data.board) {
      setVal('Board', data.board);
    }

    // CLASS
    if (Array.isArray(data.classes) && data.classes.length > 0) {
      setVal('Class', data.classes.join(', '));
    } else if (typeof data.classes === 'string') {
      setVal('Class', data.classes);
    } else if (data.class) {
      setVal('Class', data.class);
    }

    /* ================= FINAL FIELDS ================= */

    setVal('Status', 'New');
    setVal('Full_JSON_Data', JSON.stringify(data));

    sheet.appendRow(newRow);
    SpreadsheetApp.flush();

    if (lockAcquired) lock.releaseLock();

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    if (lockAcquired) lock.releaseLock();
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
