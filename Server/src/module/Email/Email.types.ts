export type EmailType =
    | "booking-confirmed"
    | "booking-cancelled"
    | "payment-success"
    | "payment-failed"
    | "otp"
    | "password-reset"
    | "welcome";

export interface SendEmailJobData {
    requestId: string;
    email: string;
    type: EmailType;
    data: Record<string, unknown>;
}