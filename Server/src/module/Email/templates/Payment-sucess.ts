import { PaymentSuccessEmailData } from "../Email.types";

export const paymentSuccessEmail = (
    data: PaymentSuccessEmailData
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

            <title>Payment Successful</title>

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
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }

                .header {
                    background-color: #f97316;
                    color: #ffffff;
                    text-align: center;
                    padding: 30px 20px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                }

                .success {
                    text-align: center;
                    padding: 30px 20px 10px;
                }

                .icon {
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    margin: auto;
                    border-radius: 50%;
                    background-color: #fff7ed;
                    color: #f97316;
                    font-size: 32px;
                    font-weight: bold;
                }

                .success h2 {
                    color: #222222;
                    margin-top: 15px;
                }

                .content {
                    padding: 25px 30px 35px;
                }

                .content p {
                    color: #555555;
                    font-size: 15px;
                    line-height: 1.7;
                }

                .section {
                    margin-top: 25px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .section-title {
                    padding: 15px;
                    background-color: #fff7ed;
                    color: #f97316;
                    font-weight: bold;
                    font-size: 16px;
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

                .amount {
                    color: #f97316;
                    font-size: 20px;
                }

                .status {
                    color: #f97316;
                    font-weight: bold;
                }

                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }

                .button {
                    display: inline-block;
                    padding: 13px 26px;
                    background-color: #f97316;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 7px;
                    font-weight: bold;
                    font-size: 14px;
                }

                .note {
                    background-color: #f8fafc;
                    padding: 15px;
                    border-radius: 8px;
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


                <div class="success">

                    <div class="icon">
                        ✓
                    </div>

                    <h2>
                        Payment Successful!
                    </h2>

                </div>


                <div class="content">

                    <p>
                        Hello <strong>${data.name}</strong>,
                    </p>

                    <p>
                        Your payment has been successfully received.
                        Your booking payment is now confirmed.
                    </p>


                    <!-- Payment Details -->

                    <div class="section">

                        <div class="section-title">
                            Payment Details
                        </div>


                        <div class="row">

                            <span class="label">
                                Payment ID
                            </span>

                            <span class="value">
                                ${data.paymentId}
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Amount Paid
                            </span>

                            <span class="value amount">
                                ${data.currency}${data.amount.toLocaleString("en-IN")}
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Payment Date
                            </span>

                            <span class="value">
                                ${data.paidAt}
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Status
                            </span>

                            <span class="value status">
                                PAID
                            </span>

                        </div>

                    </div>


                    <!-- Booking Details -->

                    <div class="section">

                        <div class="section-title">
                            Booking Details
                        </div>


                        <div class="row">

                            <span class="label">
                                Booking ID
                            </span>

                            <span class="value">
                                ${data.bookingId}
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Tour
                            </span>

                            <span class="value">
                                ${data.tourName}
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Travel Date
                            </span>

                            <span class="value">
                                ${data.travelDate}
                            </span>

                        </div>


                        <div class="row">

                            <span class="label">
                                Guests
                            </span>

                            <span class="value">
                                ${data.guests}
                            </span>

                        </div>

                    </div>


                    <div class="button-container">

                        <a
                            href="${process.env.FRONTEND_URL}/bookings/${data.bookingId}"
                            class="button"
                        >
                            View Booking
                        </a>

                    </div>


                    <div class="note">

                        Please keep this email for your records.
                        Your Payment ID and Booking ID may be required
                        for future support or refund requests.

                    </div>


                    <p>
                        Thank you for choosing TravelWorld.
                        We look forward to making your journey memorable! 🌍✈️
                    </p>


                    <p>

                        Regards,<br />

                        <strong>
                            Team TravelWorld
                        </strong>

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