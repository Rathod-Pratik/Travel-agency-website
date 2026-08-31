
import { WelcomeEmailData } from "../Email.types";

export const sendWelcomeEmail = ({name,email}: WelcomeEmailData) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>Welcome to TravelWorld</title>

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

                .button-wrapper {
                    text-align: center;
                    margin: 30px 0;
                }

                .button {
                    display: inline-block;
                    padding: 13px 25px;
                    background-color: #f97316;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: bold;
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

                    <h2>Welcome, ${name}! 👋</h2>

                    <p>
                        We're excited to have you with us.
                        Your TravelWorld account has been successfully created.
                    </p>

                    <p>
                        You can now explore amazing destinations, discover exciting
                        tours, and plan your next unforgettable journey with us.
                    </p>

                    <div class="button-wrapper">
                        <a
                            href="${process.env.FRONTEND_URL}"
                            class="button"
                        >
                            Explore TravelWorld
                        </a>
                    </div>

                    <p>
                        If you did not create this account, please contact our
                        support team immediately.
                    </p>

                    <p>
                        Happy travelling! 🌍✈️
                    </p>

                    <p>
                        <strong>Team TravelWorld</strong>
                    </p>

                </div>

                <div class="footer">
                    <p>
                        © ${new Date().getFullYear()} TravelWorld. All rights reserved.
                    </p>

                    <p>
                        This is an automated email. Please do not reply directly to this email.
                    </p>
                </div>

            </div>

        </body>
        </html>
    `;
};
