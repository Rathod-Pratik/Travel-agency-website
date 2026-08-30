import type { InvoiceJobData } from "./Invoice.types";

export const invoiceTemplate = (
    data: InvoiceJobData
) => {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);

    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8" />

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    background: #f5f7fb;
                    color: #1f2937;
                }

                .invoice {
                    width: 794px;
                    margin: 0 auto;
                    background: #ffffff;
                    min-height: 1123px;
                    padding: 40px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 25px;
                    border-bottom: 2px solid #e5e7eb;
                }

                .company-name {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .company-details {
                    font-size: 12px;
                    line-height: 1.7;
                    color: #6b7280;
                }

                .invoice-info {
                    text-align: right;
                }

                .invoice-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 10px;
                }

                .invoice-number {
                    font-size: 13px;
                    color: #4b5563;
                    margin-bottom: 5px;
                }

                .invoice-date {
                    font-size: 12px;
                    color: #6b7280;
                }

                .section {
                    margin-top: 28px;
                }

                .section-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .info-box {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                }

                .label {
                    font-size: 10px;
                    color: #9ca3af;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }

                .value {
                    font-size: 13px;
                    font-weight: 600;
                    color: #111827;
                }

                .booking-card {
                    margin-top: 25px;
                    padding: 20px;
                    border-radius: 10px;
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                }

                .tour-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 15px;
                }

                .tour-details {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }

                .tour-detail-label {
                    font-size: 10px;
                    color: #9ca3af;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }

                .tour-detail-value {
                    font-size: 12px;
                    font-weight: 600;
                    color: #374151;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th {
                    background: #f3f4f6;
                    color: #374151;
                    font-size: 11px;
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid #d1d5db;
                }

                td {
                    font-size: 12px;
                    padding: 14px 12px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .amount-section {
                    margin-top: 25px;
                    display: flex;
                    justify-content: flex-end;
                }

                .amount-box {
                    width: 250px;
                }

                .amount-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 12px;
                }

                .amount-total {
                    border-top: 2px solid #111827;
                    margin-top: 8px;
                    padding-top: 12px;
                    font-size: 18px;
                    font-weight: 700;
                }

                .payment-status {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                    background: #dcfce7;
                    color: #166534;
                }

                .footer {
                    margin-top: 60px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 11px;
                    line-height: 1.7;
                    color: #9ca3af;
                }

                .thank-you {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                }

                .notes {
                    margin-top: 30px;
                    padding: 15px;
                    border-radius: 8px;
                    background: #fafafa;
                    border: 1px solid #e5e7eb;
                }

                .notes-title {
                    font-size: 11px;
                    font-weight: 700;
                    margin-bottom: 6px;
                }

                .notes-text {
                    font-size: 10px;
                    line-height: 1.6;
                    color: #6b7280;
                }
            </style>
        </head>

        <body>

            <div class="invoice">

                <div class="header">

                    <div>
                        <div class="company-name">
                            ${data.company.name}
                        </div>

                        <div class="company-details">
                            ${data.company.email}
                            ${
                                data.company.phone
                                    ? `<br>${data.company.phone}`
                                    : ""
                            }

                            ${
                                data.company.address
                                    ? `<br>${data.company.address}`
                                    : ""
                            }

                            ${
                                data.company.website
                                    ? `<br>${data.company.website}`
                                    : ""
                            }
                        </div>
                    </div>

                    <div class="invoice-info">

                        <div class="invoice-title">
                            BOOKING INVOICE
                        </div>

                        <div class="invoice-number">
                            Invoice #${data.invoiceNumber}
                        </div>

                        <div class="invoice-date">
                            ${data.invoiceDate}
                        </div>

                    </div>

                </div>


                <div class="section">

                    <div class="section-title">
                        Customer Details
                    </div>

                    <div class="info-grid">

                        <div class="info-box">

                            <div class="label">
                                Customer Name
                            </div>

                            <div class="value">
                                ${data.customer.name}
                            </div>

                        </div>

                        <div class="info-box">

                            <div class="label">
                                Email
                            </div>

                            <div class="value">
                                ${data.customer.email}
                            </div>

                        </div>

                    </div>

                </div>


                <div class="section">

                    <div class="section-title">
                        Booking Details
                    </div>

                    <div class="info-grid">

                        <div class="info-box">

                            <div class="label">
                                Booking Code
                            </div>

                            <div class="value">
                                ${data.booking.code}
                            </div>

                        </div>

                        <div class="info-box">

                            <div class="label">
                                Booking Date
                            </div>

                            <div class="value">
                                ${data.booking.bookingDate}
                            </div>

                        </div>

                        <div class="info-box">

                            <div class="label">
                                Number of Seats
                            </div>

                            <div class="value">
                                ${data.booking.numberOfSeats}
                            </div>

                        </div>

                        <div class="info-box">

                            <div class="label">
                                Booking Status
                            </div>

                            <div class="value">
                                ${data.booking.status}
                            </div>

                        </div>

                    </div>

                </div>


                <div class="booking-card">

                    <div class="tour-name">
                        ${data.tour.name}
                    </div>

                    <div class="tour-details">

                        <div>
                            <div class="tour-detail-label">
                                Destination
                            </div>

                            <div class="tour-detail-value">
                                ${data.tour.destination ?? "N/A"}
                            </div>
                        </div>

                        <div>
                            <div class="tour-detail-label">
                                Duration
                            </div>

                            <div class="tour-detail-value">
                                ${data.tour.duration ?? "N/A"}
                            </div>
                        </div>

                        <div>
                            <div class="tour-detail-label">
                                Travel Date
                            </div>

                            <div class="tour-detail-value">
                                ${data.booking.bookingDate}
                            </div>
                        </div>

                    </div>

                </div>


                <div class="section">

                    <div class="section-title">
                        Traveller Details
                    </div>

                    <table>

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Document</th>
                            </tr>
                        </thead>

                        <tbody>

                           ${data.traveller.map((traveller) => `
                                <tr>
                                    <td>
                                        ${traveller.name}
                                    </td>

                                    <td>
                                        ${traveller.age}
                                    </td>
                                    <td>
                                        ${traveller.document}
                                    </td>
                            </tr>
                            `).join("")}

                        </tbody>

                    </table>

                </div>


                <div class="section">

                    <div class="section-title">
                        Payment Details
                    </div>

                    <div class="info-grid">

                        <div class="info-box">

                            <div class="label">
                                Payment ID
                            </div>

                            <div class="value">
                                ${
                                    data.payment.paymentId ??
                                    "N/A"
                                }
                            </div>

                        </div>

                        <div class="info-box">

                            <div class="label">
                                Payment Method
                            </div>

                            <div class="value">
                                ${
                                    data.payment.paymentMethod ??
                                    "N/A"
                                }
                            </div>

                        </div>

                        <div class="info-box">

                            <div class="label">
                                Payment Status
                            </div>

                            <div class="value">
                                <span class="payment-status">
                                    ${
                                        data.payment.status ??
                                        "PAID"
                                    }
                                </span>
                            </div>

                        </div>

                    </div>

                </div>


                <div class="amount-section">

                    <div class="amount-box">

                        <div class="amount-row">

                            <span>
                                Number of Seats
                            </span>

                            <span>
                                ${data.booking.numberOfSeats}
                            </span>

                        </div>

                        <div class="amount-row">

                            <span>
                                Booking Amount
                            </span>

                            <span>
                                ${formatCurrency(data.amount)}
                            </span>

                        </div>

                        <div class="amount-row amount-total">

                            <span>
                                Total Paid
                            </span>

                            <span>
                                ${formatCurrency(data.amount)}
                            </span>

                        </div>

                    </div>

                </div>


                <div class="notes">

                    <div class="notes-title">
                        Important Information
                    </div>

                    <div class="notes-text">
                        Please keep this invoice for your records.
                        Your booking confirmation and travel documents
                        may be required during your journey.
                        Please contact TravelWorld support if you
                        need to make changes to your booking.
                    </div>

                </div>


                <div class="footer">

                    <div class="thank-you">
                        Thank you for choosing ${data.company.name}.
                    </div>

                    This is a computer-generated invoice and
                    does not require a signature.

                </div>

            </div>

        </body>

        </html>
    `;
};