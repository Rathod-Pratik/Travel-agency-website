import puppeteer from "puppeteer";
import type { InvoiceJobData } from "./Invoice.types";
import { invoiceTemplate } from "./Invoice.template";

export const generateInvoicePdf = async (
    data: InvoiceJobData
): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
        ],
    });

    try {
        const page = await browser.newPage();

        const html = invoiceTemplate(data);

        await page.setContent(html, {
            waitUntil: "domcontentloaded",
        });

        const pdf =
            await page.pdf({
                format: "A4",
                printBackground: true,
                preferCSSPageSize: true,
                margin: {
                    top: "15mm",
                    right: "10mm",
                    bottom: "15mm",
                    left: "10mm",
                },
            });

        return Buffer.from(pdf);

    } finally {
        await browser.close();
    }
};