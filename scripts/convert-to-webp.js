const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 변환할 이미지들이 위치하는 디렉토리 (public 폴더 전체)
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// 재귀적으로 이미지 파일 탐색 (.jpg, .jpeg, .png)
function getImagesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getImagesRecursively(filePath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

async function convertImages() {
  console.log("🎨 [우리 동네 이야기] JPG/PNG -> WebP 초경량 자동 변환을 시작합니다...");

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.log("❌ public 디렉토리가 존재하지 않습니다.");
    return;
  }

  const images = getImagesRecursively(PUBLIC_DIR);

  if (images.length === 0) {
    console.log("✨ public 폴더 안에 변환할 JPG나 PNG 이미지가 없습니다.");
    return;
  }

  console.log(`🔍 총 ${images.length}개의 대상 이미지를 발견했습니다.\n`);

  let totalSavedBytes = 0;
  let convertedCount = 0;

  for (const imgPath of images) {
    const ext = path.extname(imgPath);
    const webpPath = imgPath.slice(0, -ext.length) + ".webp";

    const originalStat = fs.statSync(imgPath);
    const originalSizeKb = (originalStat.size / 1024).toFixed(1);

    try {
      // 고화질 품질(82%)로 WebP 변환 (용량 70~80% 감소)
      await sharp(imgPath)
        .webp({ quality: 82 })
        .toFile(webpPath);

      const newStat = fs.statSync(webpPath);
      const newSizeKb = (newStat.size / 1024).toFixed(1);
      const savedKb = ((originalStat.size - newStat.size) / 1024).toFixed(1);
      const ratio = (((originalStat.size - newStat.size) / originalStat.size) * 100).toFixed(0);

      totalSavedBytes += Math.max(0, originalStat.size - newStat.size);
      convertedCount++;

      console.log(`✅ [변환 완료] ${path.relative(PUBLIC_DIR, imgPath)}`);
      console.log(`   ${originalSizeKb} KB ➔ ${newSizeKb} KB (절감: ${savedKb} KB, -${ratio}% 다이어트 성공!)\n`);
    } catch (err) {
      console.error(`⚠️ 변환 실패 (${path.basename(imgPath)}):`, err.message);
    }
  }

  const totalSavedMb = (totalSavedBytes / (1024 * 1024)).toFixed(2);
  console.log(`🎉 축하합니다! 총 ${convertedCount}개 이미지 변환 완료!`);
  console.log(`🚀 총 절약된 용량: ${totalSavedMb} MB (사이트 로딩 속도가 훨씬 더 빨라집니다!)\n`);
}

convertImages();
