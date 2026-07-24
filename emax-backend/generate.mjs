import { execSync } from "child_process";
execSync("node node_modules/prisma/build/index.js generate", {
  cwd: "c:/Users/ADMIN/Desktop/E-max/emax-backend",
  stdio: "inherit",
});

