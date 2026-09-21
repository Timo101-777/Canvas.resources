// Map your folder names to their exact Google Drive Folder IDs
const FOLDERS = {
  "1": "1VKfZYNFByywCZYbYSJzBjpUVUQD6waX1",
  "2": "1NYBw4HwfsuFACuODm9pSNphKayQVaXjx",  
  "3": "1DXsKxL2-IviNKrNIzbLtOqpvHECVjJ0R",
  "Ps Ray The Tabinacle": "1KMb-uND7R1RninUZoltNzfYtDgwGdHSc",
  "5": "17pAWeisKTK6YYeN1WkMYZtlim5DDSTwD",
  "6": "1V8CQxN4vxr7XQIUOxv8_1Mea2W7tGQMw",
  "7": "1_WDCdCeAXgNir_Em_wPKlKPoOjUDr8Ir"
};

// Handle data requests coming from GitHub Pages
function doGet(e) {
  // Safe validation check if e or e.parameter doesn't load gracefully
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(JSON.stringify({error: "No parameters found"}))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  var action = e.parameter.action;
  
  // 1. If GitHub requests the folder list
  if (action === "getFolders") {
    var folders = getFolderList(); 
    return ContentService.createTextOutput(JSON.stringify(folders))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. If GitHub requests files inside a specific folder
  if (action === "getFiles") {
    var folderName = e.parameter.folderName;
    var files = getFilesFromFolder(folderName); 
    return ContentService.createTextOutput(JSON.stringify(files))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get the list of folder names to populate the dropdown menu
function getFolderList() {
  return Object.keys(FOLDERS);
}

// Fetch files dynamically based on the selected folder name
function getFilesFromFolder(folderName) {
  const folderId = FOLDERS[folderName];
  if (!folderId) return [];
  
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  const fileList = [];
  
  while (files.hasNext()) {
    const file = files.next();
    fileList.push({
      name: file.getName(),
      url: file.getUrl(),
      type: file.getMimeType()
    });
  }
  
  return fileList;
}
