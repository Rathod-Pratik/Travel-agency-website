import { BookingCancelledEmailData } from "../Email.types";

export const bookingCancelledByAdminEmail = (
    data: BookingCancelledEmailData
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

            <title>Booking Cancelled by TravelWorld</title>

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
                    color: #222222;
                    font-size: 22px;
                }

                .content p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #555555;
                }

                .notice {
                    padding: 20px;
                    background-color: #fff7ed;
                    border-left: 4px solid #f97316;
                    border-radius: 6px;
                    margin: 25px 0;
                }

                .notice strong {
                    color: #f97316;
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

                .reason {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f8fafc;
                    border-radius: 8px;
                }

                .reason p {
                    margin-bottom: 0;
                }

                .refund {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #fff7ed;
                    border-radius: 8px;
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

                    <div class="notice">

                        <strong>
                            Your booking has been cancelled by TravelWorld.
                        </strong>

                        <p>
                            We regret to inform you that your upcoming booking
                            could not be fulfilled and has been cancelled
                            by our administration team.
                        </p>

                    </div>

                    <div class="details">

                        <div class="details-title">
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
                                Booking Amount
                            </span>

                            <span class="value">
                                ₹${data.booking.totalAmount.toLocaleString("en-IN")}
                            </span>
                        </div>

                    </div>

                    ${
                        data.cancellationReason
                            ? `
                                <div class="reason">

                                    <strong>
                                        Reason for Cancellation
                                    </strong>

                                    <p>
                                        ${data.cancellationReason}
                                    </p>

                                </div>
                            `
                            : ""
                    }

                    ${
                        data.payment
                            ? `
                                <div class="refund">

                                    <strong>
                                        Payment & Refund
                                    </strong>

                                    <p>
                                        Your payment information has been
                                        recorded successfully.
                                        If your booking is eligible for a refund,
                                        the applicable refund will be processed
                                        according to our refund policy.
                                    </p>

                                </div>
                            `
                            : ""
                    }

                    <p>
                        We sincerely apologize for any inconvenience this
                        cancellation may cause.
                    </p>

                    <p>
                        If you have questions about the cancellation or refund,
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
                    </p>

                </div>

            </div>

        </body>

        </html>
    `;
};
