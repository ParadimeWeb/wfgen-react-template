import { defineConfig } from "vite";
import { readFile, writeFile } from 'fs';
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export const config = {
  env: "DEV",
  url: "http://localhost",
  // url: "http://localhost:5173",
  process: "FLUENTUI_TEMPLATE",
  processVersion: 1,
  sourceMap: true,
  htmlFileName: "index.html",
  aspxFilePaths: ["Default.aspx"],
  outDir: "build"
};

function writeToAspxFile(config) {
  return { 
    name: 'writeToAspxFile',
    writeBundle(_, bundle) {
      const html = bundle[config.htmlFileName];
      config.aspxFilePaths.forEach(aspxFilePath => {
        readFile(aspxFilePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading ${aspxFilePath}`, err);
            return;
          }
          const lines = data.split(/\r\n|\r|\n/g);
          if (lines.length > 0) {
            writeFile(aspxFilePath, `${lines[0]}\n${html.source}`, err => {
              if (err) {
                console.error(`Error writing ${aspxFilePath}`, err);
                return;
              }
              console.log(`Wrote html to ${aspxFilePath}`);
            });
          }
        });
      });
    }
  };
}

function transformIndexHtml(config) {
  return {
    name: 'transformIndexHtml',
    transformIndexHtml(html) {
      return html.replace('crossorigin', 'crossorigin="use-credentials"').replace(/"[^"]*\/favicon\.ico"/, `"${config.url}/favicon.ico"`);
    }
  };
}

export default defineConfig({
  define: {
    '__FORM_ENV': JSON.stringify(config.env),
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  },
  plugins: [TanStackRouterVite(), viteReact(), writeToAspxFile(config), transformIndexHtml(config)],
  base: `${config.url}/wfgen/wfapps/webforms/${config.process}/V${config.processVersion}/${config.outDir}/`,
  build: {
    outDir: config.outDir,
    sourcemap: config.sourceMap,
    chunkSizeWarningLimit: 2000
  },
  test: {
    globals: true,
    environment: "jsdom",
  }
});
