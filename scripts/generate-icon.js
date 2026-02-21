const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// ThinkStack 아이콘 생성
function generateIcon(size = 1024) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // 배경색 - 짙은 별색 그라데이션
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#1a1a2e");
  gradient.addColorStop(0.5, "#16213e");
  gradient.addColorStop(1, "#0f3460");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 둥근 모서리 배경
  ctx.beginPath();
  ctx.roundRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9, size * 0.15);
  ctx.fillStyle = "#e94560";
  ctx.fill();

  // 스택 아이템들 (3개의 선)
  const itemWidth = size * 0.6;
  const itemHeight = size * 0.1;
  const startX = (size - itemWidth) / 2;
  const gap = size * 0.03;
  
  // 아이템 색상들
  const colors = ["#ffffff", "#f0f0f0", "#e0e0e0"];
  const positions = [
    size * 0.35, // 위
    size * 0.5,  // 중간
    size * 0.65  // 아래
  ];

  positions.forEach((y, index) => {
    ctx.beginPath();
    ctx.roundRect(startX, y, itemWidth, itemHeight, itemHeight / 2);
    ctx.fillStyle = colors[index];
    ctx.fill();
    
    // 그림자 효과
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = size * 0.02;
    ctx.shadowOffsetY = size * 0.01;
  });

  // 번호 표시 (1, 2, 3)
  ctx.font = `bold ${size * 0.08}px Arial`;
  ctx.fillStyle = "#e94560";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  positions.forEach((y, index) => {
    ctx.fillText(
      (index + 1).toString(),
      startX + itemWidth + size * 0.12,
      y + itemHeight / 2
    );
  });

  return canvas;
}

// 아이콘 저장
function saveIcon(filename, size = 1024) {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Created: ${filename} (${size}x${size})`);
}

// 메인 실행
const outputDir = process.argv[2] || ".";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("🎨 ThinkStack 아이콘 생성 중...\n");

// 1024x1024 메인 아이콘 생성
const mainIconPath = path.join(outputDir, "app-icon.png");
saveIcon(mainIconPath, 1024);

console.log("\n📋 다음 단계:");
console.log("1. Tauri 아이콘 생성: npm run tauri icon app-icon.png");
console.log("2. 또는 src-tauri/icons/ 폴더에 수동으로 복사");
