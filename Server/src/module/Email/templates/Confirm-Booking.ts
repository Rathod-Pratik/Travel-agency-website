
import { BookingConfirmedEmailData } from "../Email.types";

export const sendBookingConfirmedEmail = (
    data: BookingConfirmedEmailData
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

            <title>Booking Confirmed - TravelWorld</title>

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

                .success {
                    text-align: center;
                    padding: 25px 20px 10px;
                }

                .success-icon {
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    background-color: #fff7ed;
                    color: #f97316;
                    font-size: 30px;
                    font-weight: bold;
                }

                .success h2 {
                    margin: 0;
                    color: #222222;
                    font-size: 22px;
                }

                .content {
                    padding: 25px 30px 35px;
                }

                .content p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #555555;
                }

                .booking-box {
                    margin-top: 25px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .booking-title {
                    background-color: #fff7ed;
                    padding: 15px;
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

                .payment-box {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f8fafc;
                    border-radius: 8px;
                }

                .payment-box h3 {
                    margin-top: 0;
                    font-size: 16px;
                    color: #222222;
                }

                .amount {
                    color: #f97316;
                    font-size: 20px;
                    font-weight: bold;
                }

                .button-container {
                    text-align: center;
                    margin: 30px 0 10px;
                }

                .button {
                    display: inline-block;
                    padding: 13px 26px;
                    background-color: #f97316;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 7px;
                    font-size: 14px;
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

                <div class="success">

                    <div class="success-icon">
                        ✓
                    </div>

                    <h2>Booking Confirmed!</h2>

                </div>

                <div class="content">

                    <p>
                        Hello <strong>${data.user.name}</strong>,
                    </p>

                    <p>
                        Great news! Your booking with TravelWorld has been
                        successfully confirmed.
                    </p>

                    <div class="booking-box">

                        <div class="booking-title">
                            Booking Details
                        </div>

                        <div class="row">
                            <span class="label">
                                Booking ID
                            </span>

                            <span class="value">
                                ${data.booking.bookingId}
                            </span>
                        </div>

                        <div class="row">
                            <span class="label">
                                Tour
                            </span>

                            <span class="value">
                                ${data.booking.tourName}
                            </span>
                        </div>

                        <div class="row">
                            <span class="label">
                                Travel Date
                            </span>

                            <span class="value">
                                ${data.booking.travelDate}
                            </span>
                        </div>

                        <div class="row">
                            <span class="label">
                                Guests
                            </span>

                            <span class="value">
                                ${data.booking.guests}
                            </span>
                        </div>

                        <div class="row">
                            <span class="label">
                                Total Amount
                            </span>

                            <span class="value">
                                ₹${data.booking.totalAmount.toLocaleString("en-IN")}
                            </span>
                        </div>

                    </div>

                    <div class="payment-box">

                        <h3>
                            Payment Details
                        </h3>

                        <p>
                            Payment ID:
                            <strong>${data.payment.paymentId}</strong>
                        </p>

                        <p>
                            Payment Status:
                            <strong>${data.payment.status}</strong>
                        </p>

                        <p>
                            Amount Paid:
                            <span class="amount">
                                ₹${data.payment.amount.toLocaleString("en-IN")}
                            </span>
                        </p>

                    </div>

                    <div class="button-container">

                        <a
                            href="${process.env.FRONTEND_URL}/bookings/${data.booking.bookingId}"
                            class="button"
                        >
                            View Booking
                        </a>

                    </div>

                    <p>
                        Please keep your Booking ID for future reference.
                        We look forward to making your journey memorable.
                    </p>

                    <p>
                        Happy travelling! 🌍✈️
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
};
