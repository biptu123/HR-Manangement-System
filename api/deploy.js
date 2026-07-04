import { exec } from "child_process";
import ftp from "basic-ftp";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEPLOY_DIR = process.env.DEPLOY_DIR; 
const DOMAIN_URL = process.env.DOMAIN_URL; 

const CONFIG = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  remoteRoot: process.env.REMOTE_ROOT,
};

const RETRY_TIME = process.env.RETRY_AFTER || 10;

// HTACCESS FOR LARAVEL PUBLIC FOLDER ROUTING
const HTACCESS_CODE = `<IfModule mod_rewrite.c>
    RewriteEngine On

    # 1. MAINTENANCE/UPDATE MODE
    RewriteCond %{DOCUMENT_ROOT}/deploy.state -f
    RewriteCond %{REQUEST_URI} !/deploy_engine.php
    RewriteRule ^(.*)$ deploy_engine.php [L,QSA]

    # 2. PUBLIC FOLDER REWRITE
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>`;

const PHP_ENGINE_CODE = `<?php
header('Content-Type: application/json');

$root = __DIR__ . "/";
$stateFile = $root . "deploy.state";
$zipFile = $root . "deploy.zip";
$originalUri = $_SERVER['REQUEST_URI'];

if (file_exists($stateFile) && file_exists($zipFile)) {
    $zip = new ZipArchive;
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($root);
        $zip->close();

        @unlink($stateFile);
        @unlink($zipFile);
        
        $self = __FILE__;
        header("Location: " . $originalUri, true, 302);
        @unlink($self);
        exit;
    }
}

http_response_code(503);
header("Retry-After: ${RETRY_TIME}");
echo json_encode([
    "status" => "updating",
    "message" => "Server is updating. Please retry in ${RETRY_TIME} seconds."
]);
exit;`;

async function runDeployment() {
  const zipPath = path.join(__dirname, "deploy.zip");
  const zip = new AdmZip();

  console.log("🤐 Packing all Laravel directories...");

  const dirs = [
    "app",
    "bootstrap",
    "config",
    "database",
    "public",
    "resources",
    "routes",
    "storage",
    "vendor"
  ];

  dirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      zip.addLocalFolder(dir, dir);
    }
  });

  const files = [
    "artisan",
    "composer.json",
    "composer.lock",
    "package.json"
  ];

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      zip.addLocalFile(file);
    }
  });

  zip.writeZip(zipPath);
  
  const stats = fs.statSync(zipPath);
  const fileSizeInMegabytes = (stats.size / (1024*1024)).toFixed(2);
  console.log(`\n✅ Zip complete! Total Size: ${fileSizeInMegabytes} MB`);

  await uploadAll(zipPath);
}

async function uploadAll(zipPath) {
  const client = new ftp.Client();
  const startTime = Date.now();

  try {
    await client.access(CONFIG);
    console.log(`📡 Connected. Targeting folder: ${DEPLOY_DIR}`);

    client.trackProgress((info) => {
      const bytes = (info.bytesOverall / 1024 / 1024).toFixed(2);
      process.stdout.write(`\r📤 Uploading package: ${bytes} MB transferred...`);
    });

    // 1. Upload ZIP
    await client.uploadFrom(zipPath, `${DEPLOY_DIR}/deploy.zip`);
    client.trackProgress(); 
    console.log("\n✅ ZIP uploaded.");

    // 2. Upload .env.prod renamed as .env
    if (fs.existsSync(".env.prod")) {
      console.log("🔐 Found .env.prod, uploading as .env...");
      await client.uploadFrom(".env.prod", `${DEPLOY_DIR}/.env`);
      console.log("✅ .env uploaded.");
    } else {
      console.log("⚠️ Warning: .env.prod not found locally. Skipping environment file upload.");
    }

    // 3. Upload Engine
    fs.writeFileSync("deploy_engine.php", PHP_ENGINE_CODE);
    await client.uploadFrom("deploy_engine.php", `${DEPLOY_DIR}/deploy_engine.php`);

    // 4. Upload Trigger
    fs.writeFileSync("deploy.state", "zipped=true");
    await client.uploadFrom("deploy.state", `${DEPLOY_DIR}/.state`); // Keep hidden if preferred, matching engine trigger
    
    // Quick fix: The engine looks for deploy.state in the root directory
    await client.uploadFrom("deploy.state", `${DEPLOY_DIR}/deploy.state`);

    // 5. Upload Htaccess
    fs.writeFileSync("htaccess_temp", HTACCESS_CODE);
    if (fs.existsSync("htaccess_temp")) {
      await client.uploadFrom("htaccess_temp", `${DEPLOY_DIR}/.htaccess`);
    }
    fs.unlinkSync("htaccess_temp");

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 DEPLOYED SUCCESSFULLY in ${duration}s!`);
    console.log(`🌍 Opening browser to trigger extraction: ${DOMAIN_URL}`);

    const startCmd = process.platform == "darwin" ? "open" : process.platform == "win32" ? "start" : "xdg-open";
    exec(`${startCmd} ${DOMAIN_URL}`, (error) => {
      if (error) console.log("ℹ️ Note: Could not auto-open browser.");
    });
  } catch (err) {
    console.error("\n❌ Error during deployment:", err);
  } finally {
    client.close();
    ["deploy.zip", "deploy_engine.php", "deploy.state"].forEach((f) => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
  }
}

runDeployment();