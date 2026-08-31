import { RefundProcessEmailData } from "../Email.types";

export const RefundProcessedEmail = (
    data: RefundProcessEmailData
) => {
    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8" />

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            <title>Refund Processing - TravelWorld</title>

            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f4f7fb;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #333333;
                }

                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                }

                .header {
                    background-color: #f97316;
                    padding: 30px 20px;
                    text-align: center;
                    color: #ffffff;
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                }

                .content {
                    padding: 35px 30px;
                }

                .content h2 {
                    margin-top: 0;
                    color: #222222;
                    font-size: 22px;
                }

                .content p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #555555;
                }

                .refund-status {
                    text-align: center;
                    margin: 25px 0;
                    padding: 25px 20px;
                    background-color: #fff7ed;
                    border-radius: 8px;
                }

                .refund-icon {
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    background-color: #ffffff;
                    color: #f97316;
                    font-size: 30px;
                    font-weight: bold;
                }

                .refund-status h3 {
                    margin: 0;
                    color: #f97316;
                    font-size: 19px;
                }

                .refund-status p {
                    margin-bottom: 0;
                    font-size: 13px;
                }

                .amount {
                    margin: 25px 0;
                    text-align: center;
                }

                .amount-label {
                    display: block;
                    color: #777777;
                    font-size: 13px;
                    margin-bottom: 5px;
                }

                .amount-value {
                    color: #f97316;
                    font-size: 30px;
                    font-weight: bold;
                }

                .details {
                    margin-top: 25px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .details-title {
                    padding: 15px;
                    background-color: #fff7ed;
                    color: #f97316;
                    font-size: 16px;
                    font-weight: bold;
                }

                .row {
                    padding: 12px 15px;
                    border-bottom: 1px solid #eeeeee;
                    font-size: 14px;
                }

                .row:last-child {
                    border-bottom: none;
                }

                .label {
                    color: #777777;
                }

                .value {
                    float: right;
                    color: #222222;
                    font-weight: bold;
                }

                .notice {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f8fafc;
                    border-radius: 8px;
                }

                .notice p {
                    margin: 0;
                    font-size: 13px;
                    color: #666666;
                }

                .footer {
                    padding: 20px 30px;
                    background-color: #f8fafc;
                    text-align: center;
                    color: #888888;
                    font-size: 12px;
                }
            </style>
        </head>

        <body>

            <div class="container">

                <div class="header">
                    <h1>TravelWorld</h1>
                </div>

                <div class="content">

                    <h2>Hello ${data.user.name},</h2>

                    <p>
                        We wanted to let you know that your refund request
                        has been successfully initiated and is currently
                        being processed.
                    </p>

                    <div class="refund-status">

                        <div class="refund-icon">
                            $
                        </div>

                        <h3>
                            Refund Processing
                        </h3>

                        <p>
                            Your refund is on its way.
                        </p>

                    </div>

                    <div class="amount">

                        <span class="amount-label">
                            Refund Amount
                        </span>

                        <span class="amount-value">
                            ${data.payment.currency ?? "₹"}${data.payment.refundAmount.toLocaleString("en-IN")}
                        </span>

                    </div>

                    <div class="details">

                        <div class="details-title">
                            Refund Details
                        </div>

                        <div class="row">

                            <span class="label">
                                Payment ID
                            </span>

                            <span class="value">
                                ${data.payment.paymentId}
                            </span>

                        </div>

                        ${
                            data.payment.refundId
                                ? `
                                    <div class="row">

                                        <span class="label">
                                            Refund ID
                                        </span>

                                        <span class="value">
                                            ${data.payment.refundId}
                                        </span>

                                    </div>
                                `
                                : ""
                        }

                        <div class="row">

                            <span class="label">
                                Refund Amount
                            </span>

                            <span class="value">
                                ${data.payment.currency ?? "₹"}${data.payment.refundAmount.toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div class="row">

                            <span class="label">
                                Status
                            </span>

                            <span class="value">
                                Processing
                            </span>

                        </div>

                        <div class="row">

                            <span class="label">
                                Initiated On
                            </span>

                            <span class="value">
                                ${data.payment.processedAt}
                            </span>

                        </div>

                    </div>

                    <div class="notice">

                        <p>
                            <strong>Please note:</strong>
                            Refund processing time may vary depending on
                            your bank or payment provider. The refunded
                            amount will be credited back to the original
                            payment method.
                        </p>

                    </div>

                    <p>
                        You don't need to take any further action at this time.
                    </p>

                    <p>
                        If you have any questions regarding your refund,
                        please contact our support team.
                    </p>

                    <p>
                        Thank you for choosing TravelWorld.
                    </p>

                    <p>
                        Regards,<br />
                        <strong>Team TravelWorld</strong>
                    </p>

                </div>

                <div class="footer">

                    <p>
                        © ${new Date().getFullYear()}
                        TravelWorld. All rights reserved.
                    </p>

                    <p>
                        This is an automated email.
                        Please do not reply to this email.
                    </p>

                </div>

            </div>

        </body>

        </html>
    `;
}