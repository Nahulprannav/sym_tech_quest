/** Project Cipher completion logger. Deploy as a Web App, executing as you, accessible to anyone. */
const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const TAB_NAME = 'Completions';
const HEADERS = ['Event ID', 'Completed At (UTC)', 'Team Name', 'Assigned Team', 'Station', 'Score (/3)', 'Status', 'Key', 'Final Phrase'];

function doPost(e) {
  try {
    if (SPREADSHEET_ID === 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE') throw new Error('Set SPREADSHEET_ID in Code.gs first.');
    const input = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const team = String(input.assignedTeam || '');
    const station = Number(input.station);
    const score = Number(input.score);
    if (!['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].includes(team)) throw new Error('Invalid team.');
    if (!Number.isInteger(station) || station < 1 || station > 5) throw new Error('Invalid station.');
    if (!Number.isInteger(score) || score < 0 || score > 3) throw new Error('Invalid score.');
    const teamName = safeCell(input.teamName, 50);
    if (!teamName) throw new Error('Team name is required.');
    const status = safeCell(input.status || (station < 5 ? 'station complete' : 'checkpoint complete'), 40);
    const key = safeCell(input.key, 30);
    const phrase = safeCell(input.finalPhrase, 60);
    const eventId = safeCell(input.eventId, 160);
    if (!eventId) throw new Error('Event ID is required.');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB_NAME)
        || SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(TAB_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      }
      const last = sheet.getLastRow();
      const ids = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getDisplayValues().flat() : [];
      const found = ids.indexOf(eventId);
      const row = [eventId, input.completedAt || new Date().toISOString(), teamName, team, station, score, status, key, phrase];
      if (found >= 0) sheet.getRange(found + 2, 1, 1, row.length).setValues([row]);
      else sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function safeCell(value, maxLength) {
  let text = String(value == null ? '' : value).trim().slice(0, maxLength);
  if (/^[=+@\-]/.test(text)) text = "'" + text;
  return text;
}
function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
