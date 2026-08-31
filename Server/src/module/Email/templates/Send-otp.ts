import { OtpEmailData } from "../Email.types";

export const sendOtpEmail = (data: OtpEmailData) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            <title>Your TravelWorld OTP</title>

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

                .otp-container {
                    text-align: center;
                    margin: 30px 0;
                }

                .otp {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #fff7ed;
                    border: 2px dashed #f97316;
                    border-radius: 8px;
                    color: #f97316;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                }

                .expiry {
                    text-align: center;
                    font-size: 13px;
                    color: #777777;
                    margin-top: 10px;
                }

                .security {
                    background-color: #fff7ed;
                    border-left: 4px solid #f97316;
                    padding: 15px;
                    margin-top: 25px;
                }

                .security p {
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

                    <h2>Hello ${data.name}! 👋</h2>

                    <p>
                        We received a request to verify your email address
                        for your TravelWorld account.
                    </p>

                    <p>
                        Please use the following One-Time Password (OTP)
                        to continue:
                    </p>

                    <div class="otp-container">
                        <div class="otp">
                            ${data.otp}
                        </div>

                        <div class="expiry">
                            This OTP will expire in
                            <strong>${data.expiresInMinutes} minutes</strong>.
                        </div>
                    </div>

                    <div class="security">
                        <p>
                            <strong>Security notice:</strong>
                            Never share this OTP with anyone.
                            TravelWorld will never ask you for your OTP.
                        </p>
                    </div>

                    <p>
                        If you did not request this verification code,
                        you can safely ignore this email.
                    </p>

                    <p>
                        Thanks,<br />
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
};
