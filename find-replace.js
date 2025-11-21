// ============================================
// SCRIPT: Find & Replace Nama Sekolah
// SMP Muslimin Cililin -> SMPN 2 Cililin
// ============================================
// Jalankan: node find-replace.js
// ============================================

const fs = require("fs");
const path = require("path");

// Konfigurasi replacement
const replacements = [
  // Variasi lengkap dengan "Cililin"
  { from: /SMP Muslimin Cililin/gi, to: "SMPN 2 Cililin" },
  { from: /SMPM Muslimin Cililin/gi, to: "SMPN 2 Cililin" },
  { from: /SMP\s+Muslimin\s+Cililin/gi, to: "SMPN 2 Cililin" },

  // Variasi tanpa "Cililin"
  { from: /SMP Muslimin/gi, to: "SMPN 2 Cililin" },
  { from: /SMPM Muslimin/gi, to: "SMPN 2 Cililin" },
  { from: /SMPMuslimin/gi, to: "SMPN2Cililin" },
  { from: /smpmuslimin/gi, to: "smpn2cililin" },

  // Variasi singkatan
  { from: /SMPM Cililin/gi, to: "SMPN 2 Cililin" },
  { from: /SMPM/gi, to: "SMPN 2" },

  // Variasi untuk nama file/folder/variable (tanpa spasi)
  { from: /SMPMusliminCililin/gi, to: "SMPN2Cililin" },
  { from: /smpmuslimincililin/gi, to: "smpn2cililin" },
  { from: /Smp_Muslimin/gi, to: "SMPN_2_Cililin" },
  { from: /smp_muslimin/gi, to: "smpn_2_cililin" },

  // Variasi dengan dash
  { from: /smp-muslimin-cililin/gi, to: "smpn-2-cililin" },
  { from: /smp-muslimin/gi, to: "smpn-2-cililin" },

  // Khusus Muslimin saja (hati-hati, ini general)
  // Uncomment jika diperlukan:
  // { from: /Muslimin/gi, to: "SMPN 2" },
];

// Folder yang akan di-scan
const foldersToScan = ["./src", "./public"];

// Extension file yang akan diproses
const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".html",
  ".css",
  ".scss",
  ".txt",
  ".md",
  ".env.example",
];

// File/folder yang di-skip
const skipItems = [
  "node_modules",
  ".git",
  "build",
  "dist",
  ".env",
  "package-lock.json",
  "yarn.lock",
  "find-replace.js", // Skip script ini sendiri
];

let totalFilesProcessed = 0;
let totalReplacements = 0;
let modifiedFiles = [];

// Fungsi rekursif untuk scan folder
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // Skip folder/file tertentu
    if (skipItems.some((skip) => fullPath.includes(skip))) {
      return;
    }

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath);

      if (allowedExtensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  });
}

// Fungsi untuk process file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;
    let fileReplacements = 0;

    // Lakukan semua replacement
    replacements.forEach(({ from, to }) => {
      const matches = content.match(from);
      if (matches) {
        content = content.replaceAll(from, to);
        fileReplacements += matches.length;
      }
    });

    // Tulis kembali jika ada perubahan
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ [${fileReplacements}x] ${filePath}`);
      totalFilesProcessed++;
      totalReplacements += fileReplacements;
      modifiedFiles.push({ path: filePath, count: fileReplacements });
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
console.log("🔍 Find & Replace: SMP Muslimin → SMPN 2 Cililin\n");
console.log("📂 Folder yang di-scan:", foldersToScan.join(", "));
console.log("📄 Extension:", allowedExtensions.join(", "));
console.log("⭕ Skip:", skipItems.join(", "));
console.log("\n" + "=".repeat(60) + "\n");

const startTime = Date.now();

foldersToScan.forEach((folder) => {
  if (fs.existsSync(folder)) {
    console.log(`📁 Scanning: ${folder}`);
    scanDirectory(folder);
  } else {
    console.log(`⚠️  Folder tidak ditemukan: ${folder}`);
  }
});

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log("\n" + "=".repeat(60));
console.log("\n📊 HASIL REPLACEMENT:");
console.log(`✅ File dimodifikasi: ${totalFilesProcessed}`);
console.log(`🔄 Total replacement: ${totalReplacements}`);
console.log(`⏱️  Waktu eksekusi: ${duration}s`);

if (modifiedFiles.length > 0) {
  console.log("\n📝 Detail file yang diubah:");
  modifiedFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.path} (${file.count}x)`);
  });
}

console.log(
  "\n✨ Selesai! Semua 'SMP Muslimin' sudah diganti jadi 'SMPN 2 Cililin'.\n"
);

if (totalReplacements === 0) {
  console.log('ℹ️  Tidak ada "SMP Muslimin" yang ditemukan.');
  console.log("   Kemungkinan sudah diganti sebelumnya atau nama berbeda.\n");
  console.log(
    "💡 Tips: Coba cek manual dengan search di VS Code (Ctrl+Shift+F)\n"
  );
}
