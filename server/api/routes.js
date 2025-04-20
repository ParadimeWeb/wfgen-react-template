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
            await new Promise((resolve) => setTimeout(resolve, 5000));
            json = initData;
            break;
        case "ASYNC_GetUsers":
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
            console.log(body);
            console.log(files);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            //const mode = body.mode;
            const field = body.field;
            const Key = body.key;
            const f = files[0];
            json = {
                Key,
                Path: `upload\\${field}\\${f.originalname}`,
                Name: f.originalname
            };
            break;
        case "ASYNC_MISSING_KEY":
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
