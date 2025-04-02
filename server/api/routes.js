import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { initData, users } from "./data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

router.get("/test", (_, res) => {
    res.json({
        result: "Hello World",
    });
});

router.post("/Default.aspx", async (req, res) => {
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    let json = {};
    
    // Access form data through req.body for regular form fields
    const { body, files } = req;
    
    // Get the action from the form data
    const action = body.__WFGENACTION;
    switch (action) {
        case "ASYNC_INIT":
            json = initData;
            break;
        case "ASYNC_USERS":
            const page = Number(body.page);
            const pageSize = Number(body.pageSize);
            const query = (body.query).toLowerCase();
            const filtered =
                query === ""
                    ? users
                    : users.filter((u) =>
                          u.CommonName.toLowerCase().includes(query)
                      );
            const Rows = filtered.slice((page - 1) * pageSize, page * pageSize);
            json = {
                Rows,
                Total: filtered.length,
                HasNextPage: filtered.length > page * pageSize,
            };
            break;
        case "ASYNC_CANCEL":
            await new Promise((resolve) => setTimeout(resolve, 5000));
            json = {
                error: "Error canceling.",
                replyTo: "",
            };
            break;
        case "ASYNC_REJECT":
            await new Promise((resolve) => setTimeout(resolve, 5000));
            json = {
                error: "Error rejecting.",
                replyTo: "",
            };
            break;
        case "ASYNC_APPROVE":
            await new Promise((resolve) => setTimeout(resolve, 5000));
            json = {
                error: "Error approving.",
                replyTo: "",
            };
            break;
        case "ASYNC_SAVE":
            await new Promise((resolve) => setTimeout(resolve, 5000));
            json = {
                error: "Error saving.",
                replyTo: "",
            };
            break;
        case "ASYNC_SUBMIT":
            await new Promise((resolve) => setTimeout(resolve, 5000));
            json = {
                error: "Error submitting.",
                replyTo: "",
            };
            break;
        case "ASYNC_UPLOAD":
            const fields = JSON.parse(body.fields);
            json = files.map((f, i) => {
                const Key = fields[i];
                return new URLSearchParams({
                    Key,
                    Path: `upload\\${Key}\\${f.originalname}`,
                    Name: f.originalname
                }).toString();
            });
            await new Promise((resolve) => setTimeout(resolve, 5000));
            break;
        case "ASYNC_UPLOAD_ZIP":
            const field = body.field;
            const urlParams = new URLSearchParams();
            files.forEach((f, i) => {
                urlParams.append('Key', `Zip${i}`);
                urlParams.append('Path', `zip\\${f.originalname}`);
                urlParams.append('Name', f.originalname);
            });
            json = [urlParams.toString()];
            break;
        case "ASYNC_MISSING_KEY":
            const key = body.key;
            const enFilePath = path.resolve(__dirname, "../../src/i18n/locales/en/translation.json");
            const frFilePath = path.resolve(__dirname, "../../src/i18n/locales/fr/translation.json");
            let enTranslation = fs.readFileSync(
                enFilePath,
                "utf-8"
            );
            let frTranslation = fs.readFileSync(
                frFilePath,
                "utf-8"
            );
            let newTranslation = { ...JSON.parse(enTranslation), [key]: key };
            fs.writeFileSync(enFilePath, JSON.stringify(newTranslation, null, 4));
            newTranslation = { ...JSON.parse(frTranslation), [key]: key };
            fs.writeFileSync(frFilePath, JSON.stringify(newTranslation, null, 4));
            json = {
                Result: "OK"
            };
            break;
        default:
            json = { error: `${action} not found.` };
            break;
    }
    res.json(json);
});

export default router;
