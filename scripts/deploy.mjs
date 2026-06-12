import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const dist = path.join(root, ".vitepress", "dist");

function rmIfExists(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(dist)) {
  console.error("❌ Build output not found:", dist);
  console.error("Run: npm run build");
  process.exit(1);
}

rmIfExists(path.join(root, "assets"));
rmIfExists(path.join(root, "index.html"));
rmIfExists(path.join(root, "404.html"));

copyDir(dist, root);

console.log("✅ Deployed docs:");
console.log(" - VitePress dist ->", root);
