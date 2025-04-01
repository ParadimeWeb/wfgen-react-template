import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import apiRoutes from "./server/api/routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
    const app = express();

    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
    });

    // Use vite's connect instance as middleware. If you use your own
    // express router (express.Router()), you should use router.use
    // When the server restarts (for example after the user modifies
    // vite.config.js), `vite.middlewares` is still going to be the same
    // reference (with a new internal stack of Vite and plugin-injected
    // middlewares). The following is valid even after restarts.
    app.use(vite.middlewares);

    // Setup multer for handling multipart/form-data
    const upload = multer({ dest: "uploads/" });
    app.use(upload.any());

    app.use("/api", apiRoutes);

    app.use("*", async (req, res, next) => {
        const url = req.originalUrl;

        try {
            // 1. Read index.html
            let template = fs.readFileSync(
                path.resolve(__dirname, "index.html"),
                "utf-8"
            );

            // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
            //    and also applies HTML transforms from Vite plugins, e.g. global
            //    preambles from @vitejs/plugin-react
            template = await vite.transformIndexHtml(url, template);

            // 3. Send the rendered HTML back.
            res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace so it maps back
            // to your actual source code.
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    app.listen(5173, () => {
        console.log('Server running at http://localhost:5173');
    });
}

createServer();
