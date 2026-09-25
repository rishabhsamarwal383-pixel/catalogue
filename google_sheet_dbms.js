/**
 * =========================================================================
 * BOX COMPANY UDAIPUR - GOOGLE SHEETS CLOUD DBMS & REALTIME BACKEND
 * =========================================================================
 * This Google Apps Script turns any Google Spreadsheet into an automated
 * real-time database (DBMS) for your Box Reselling business.
 *
 * It automatically logs:
 *   1. 📦 Orders (Size, Qty, Total ₹, Customer Phone, Address, Landmark, Pincode, GPS, UPI Status)
 *   2. 📲 App Downloads & PWA Installs (Device, OS, Browser, Screen Size, Status)
 *   3. 👁️ Visitors & Traffic (Visitor ID, Source/Referrer, Platform, Language, City/IP)
 *   4. 📊 Analytics & Events (3D Studio views, Size Searches, WhatsApp Clicks, UPI QR Scans)
 *   5. 📈 Live KPI Dashboard (Total Revenue, Orders, Installs, Conversion Rate)
 *
 * HOW TO SET UP IN 2 MINUTES:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename the sheet: "Box Company Udaipur - Master DBMS"
 * 3. In menu, click Extensions ➔ Apps Script
 * 4. Delete any code in Code.gs, paste this entire file, and click Save (💾).
 * 5. Click "Run" ➔ Select "setupDatabase" (Grant Google permission if prompted).
 *    All 5 styled tabs will be created automatically!
 * 6. Click "Deploy" (top right) ➔ "New deployment"
 * 7. Select type: "Web app"
 *    - Description: "Box Company DBMS Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Critical for your website to post data)
 * 8. Click "Deploy" and COPY the Web App URL (ends with /exec).
 * 9. Paste that URL into your catalog app or index.html GOOGLE_SHEET_WEBHOOK_URL!
 * =========================================================================
 */

// Custom Menu when opening Google Sheet
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Box Company DBMS')
    .addItem('🚀 Setup All 5 Database Sheets', 'setupDatabase')
    .addItem('🔄 Refresh KPI Dashboard', 'updateKPIDashboard')
    .addItem('🧹 Clean Test Rows', 'cleanTestRows')
    .addToUi();
}

/**
 * 1. AUTOMATIC DATABASE SETUP
 * Creates and styles all 5 sheets with frozen headers, colors, and formatting.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- SHEET 1: ORDERS ---
  let orderSheet = ss.getSheetByName('📦 Orders');
  if (!orderSheet) {
    orderSheet = ss.insertSheet('📦 Orders');
  }
  const orderHeaders = [
    'Timestamp (IST)',
    'Order ID',
    'Box Dimensions (LxWxH)',
    'Ply',
    'Quantity',
    'Unit Rate (₹)',
    'Total Amount (₹)',
    'Customer Phone',
    'Delivery Address',
    'Landmark',
    'Pincode',
    'Shop / Brand Name',
    'Live GPS Location',
    'Payment Mode',
    'Payment Status',
    'Device / User Agent'
  ];
  setupHeaderRow(orderSheet, orderHeaders, '#065F46'); // Emerald Green Header
  orderSheet.setColumnWidth(1, 160);
  orderSheet.setColumnWidth(2, 130);
  orderSheet.setColumnWidth(3, 160);
  orderSheet.setColumnWidth(7, 120);
  orderSheet.setColumnWidth(8, 130);
  orderSheet.setColumnWidth(9, 240);
  orderSheet.setColumnWidth(10, 160);
  orderSheet.setColumnWidth(11, 90);
  orderSheet.setColumnWidth(13, 200);

  // --- SHEET 2: APP DOWNLOADS ---
  let dlSheet = ss.getSheetByName('📲 App Downloads');
  if (!dlSheet) {
    dlSheet = ss.insertSheet('📲 App Downloads');
  }
  const dlHeaders = [
    'Timestamp (IST)',
    'Event Type',
    'Platform / OS',
    'Screen Resolution',
    'Browser',
    'Referrer Source',
    'Status',
    'Device Info'
  ];
  setupHeaderRow(dlSheet, dlHeaders, '#4F46E5'); // Indigo Header
  dlSheet.setColumnWidth(1, 160);
  dlSheet.setColumnWidth(3, 130);
  dlSheet.setColumnWidth(8, 260);

  // --- SHEET 3: VISITORS & TRAFFIC ---
  let visitorSheet = ss.getSheetByName('👁️ Visitors');
  if (!visitorSheet) {
    visitorSheet = ss.insertSheet('👁️ Visitors');
  }
  const visitorHeaders = [
    'Timestamp (IST)',
    'Visitor ID',
    'Referrer / Traffic Source',
    'Device Platform',
    'Screen Size',
    'Language',
    'User Agent'
  ];
  setupHeaderRow(visitorSheet, visitorHeaders, '#0284C7'); // Sky Blue Header
  visitorSheet.setColumnWidth(1, 160);
  visitorSheet.setColumnWidth(2, 140);
  visitorSheet.setColumnWidth(3, 200);
  visitorSheet.setColumnWidth(7, 260);

  // --- SHEET 4: ANALYTICS & EVENTS ---
  let eventSheet = ss.getSheetByName('📊 Analytics');
  if (!eventSheet) {
    eventSheet = ss.insertSheet('📊 Analytics');
  }
  const eventHeaders = [
    'Timestamp (IST)',
    'Action Type',
    'Box Dimensions / Item',
    'Search Query / Filter',
    'Quantity Selected',
    'Button / Element Clicked',
    'Visitor ID'
  ];
  setupHeaderRow(eventSheet, eventHeaders, '#D97706'); // Amber Header
  eventSheet.setColumnWidth(1, 160);
  eventSheet.setColumnWidth(2, 160);
  eventSheet.setColumnWidth(3, 180);
  eventSheet.setColumnWidth(6, 180);

  // --- SHEET 5: KPI DASHBOARD ---
  setupKPIDashboard(ss);

  // Remove default "Sheet1" if present
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  SpreadsheetApp.flush();
  return 'Database setup complete with all 5 sheets!';
}

function setupHeaderRow(sheet, headers, bgColor) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground(bgColor);
  range.setFontColor('#FFFFFF');
  range.setFontWeight('bold');
  range.setFontSize(10);
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);
}

/**
 * 2. LIVE KPI DASHBOARD BUILDER
 */
function setupKPIDashboard(ss) {
  let dash = ss.getSheetByName('📈 KPI Dashboard');
  if (!dash) {
    dash = ss.insertSheet('📈 KPI Dashboard', 0);
  }

  dash.clear();
  dash.getRange('A1:E1').merge()
    .setValue('📦 BOX COMPANY UDAIPUR - REAL-TIME BUSINESS KPI DASHBOARD')
    .setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  dash.setRowHeight(1, 40);

  // Metric Cards (Row 3-4)
  const metrics = [
    ['Total Orders Placed', '=COUNTA(\'📦 Orders\'!B2:B)', 'B3:B4', '#ECFDF5', '#065F46'],
    ['Total Revenue (₹)', '=SUM(\'📦 Orders\'!G2:G)', 'C3:C4', '#FEF3C7', '#92400E'],
    ['Total App Installs', '=COUNTA(\'📲 App Downloads\'!A2:A)', 'D3:D4', '#EEF2FF', '#3730A3'],
    ['Total Visitor Sessions', '=COUNTA(\'👁️ Visitors\'!A2:A)', 'E3:E4', '#E0F2FE', '#075985']
  ];

  metrics.forEach((m, idx) => {
    const col = idx + 2; // B to E
    dash.getRange(3, col).setValue(m[0]).setFontSize(9).setFontWeight('bold').setHorizontalAlignment('center').setBackground(m[3]).setFontColor(m[4]);
    dash.getRange(4, col).setValue(m[1]).setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center').setBackground(m[3]).setFontColor(m[4]);
  });

  // Recent Orders Mini Table
  dash.getRange('B7:E7').merge().setValue('⚡ Quick Order Tracker (Auto-Updates)').setFontWeight('bold').setFontSize(11).setBackground('#F1F5F9');
  dash.getRange('B8:E8').setValues([['Order ID', 'Box Size', 'Quantity', 'Amount (₹)']]).setFontWeight('bold').setBackground('#E2E8F0');

  for (let i = 9; i <= 18; i++) {
    const rowIdx = i - 7;
    dash.getRange(i, 2).setValue(`=IFERROR(INDEX('📦 Orders'!B$2:B, ${rowIdx}), "")`);
    dash.getRange(i, 3).setValue(`=IFERROR(INDEX('📦 Orders'!C$2:C, ${rowIdx}), "")`);
    dash.getRange(i, 4).setValue(`=IFERROR(INDEX('📦 Orders'!E$2:E, ${rowIdx}), "")`);
    dash.getRange(i, 5).setValue(`=IFERROR(INDEX('📦 Orders'!G$2:G, ${rowIdx}), "")`);
  }

  dash.setColumnWidth(1, 30);
  dash.setColumnWidth(2, 140);
  dash.setColumnWidth(3, 160);
  dash.setColumnWidth(4, 120);
  dash.setColumnWidth(5, 140);
}

/**
 * 3. REALTIME WEBHOOK LISTENER (doPost)
 * Receives incoming telemetry from Catalogue Web App and routes to right tab.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const type = (payload.type || payload.event || '').toLowerCase();
    const nowIST = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (type === 'order') {
      let sheet = ss.getSheetByName('📦 Orders') || ss.insertSheet('📦 Orders');
      sheet.appendRow([
        nowIST,
        payload.orderId || ('BOX-' + Math.floor(100000 + Math.random() * 900000)),
        payload.dimensions || `${payload.l || ''}x${payload.w || ''}x${payload.h || ''} In`,
        payload.ply || 3,
        payload.quantity || payload.qty || 50,
        payload.unitPrice || 0,
        payload.total || payload.totalAmount || 0,
        "'" + (payload.phone || ''), // Leading apostrophe preserves phone format in Excel
        payload.address || '',
        payload.landmark || '',
        "'" + (payload.pincode || ''),
        payload.shopName || '',
        payload.gps || payload.gpsLocation || '',
        payload.paymentMode || 'UPI Instant',
        payload.paymentStatus || 'Initiated / Form Confirmed',
        payload.userAgent || ''
      ]);
    } else if (type === 'download' || type === 'app_install' || type === 'install') {
      let sheet = ss.getSheetByName('📲 App Downloads') || ss.insertSheet('📲 App Downloads');
      sheet.appendRow([
        nowIST,
        payload.eventType || 'App Install Prompt Accepted',
        payload.platform || 'Mobile',
        payload.screen || '',
        payload.browser || '',
        payload.referrer || 'Direct',
        payload.status || 'Installed',
        payload.userAgent || ''
      ]);
    } else if (type === 'visitor' || type === 'session') {
      let sheet = ss.getSheetByName('👁️ Visitors') || ss.insertSheet('👁️ Visitors');
      sheet.appendRow([
        nowIST,
        payload.visitorId || ('V-' + Math.floor(100000 + Math.random() * 900000)),
        payload.referrer || 'Direct',
        payload.platform || '',
        payload.screen || '',
        payload.language || 'en',
        payload.userAgent || ''
      ]);
    } else if (type === 'analytics' || type === 'interaction') {
      let sheet = ss.getSheetByName('📊 Analytics') || ss.insertSheet('📊 Analytics');
      sheet.appendRow([
        nowIST,
        payload.action || 'view',
        payload.item || payload.dimensions || '',
        payload.searchQuery || payload.filter || '',
        payload.quantity || '',
        payload.button || payload.label || '',
        payload.visitorId || ''
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      receivedAt: nowIST,
      type: type
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * 4. GET ENDPOINT (doGet)
 * Allows in-app admin dashboard to view live summary counts.
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const orderSheet = ss.getSheetByName('📦 Orders');
  const dlSheet = ss.getSheetByName('📲 App Downloads');
  const visSheet = ss.getSheetByName('👁️ Visitors');

  const totalOrders = orderSheet ? Math.max(0, orderSheet.getLastRow() - 1) : 0;
  const totalDownloads = dlSheet ? Math.max(0, dlSheet.getLastRow() - 1) : 0;
  const totalVisitors = visSheet ? Math.max(0, visSheet.getLastRow() - 1) : 0;

  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    appName: 'Box Company Udaipur DBMS',
    totalOrders: totalOrders,
    totalDownloads: totalDownloads,
    totalVisitors: totalVisitors,
    timestamp: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss')
  })).setMimeType(ContentService.MimeType.JSON);
}

function cleanTestRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['📦 Orders', '📲 App Downloads', '👁️ Visitors', '📊 Analytics'].forEach(name => {
    const s = ss.getSheetByName(name);
    if (s && s.getLastRow() > 1) {
      s.deleteRows(2, s.getLastRow() - 1);
    }
  });
}
