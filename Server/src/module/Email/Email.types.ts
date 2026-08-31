export type EmailType =
    | "welcome"
    | "otp"
    | "password-reset"
    | "booking-confirmed"
    | "booking-cancelled-user"
    | "booking-cancelled-admin"
    | "payment-success"
    | "refund-processed"
    | "booking-reminder";

export interface WelcomeEmailData {
    name: string;
    email: string;
}

export interface OtpEmailData {
    name: string;
    email: string;
    otp: string;
    expiresInMinutes: number;
}

export interface PasswordResetEmailData {
    name: string;
    email: string;
    resetToken: string;
    expiresInMinutes: number;
}

export interface BookingConfirmedEmailData {
    user: {
        name: string;
        email: string;
    };

    booking: {
        bookingId: string;
        tourName: string;
        travelDate: string;
        guests: number;
        totalAmount: number;
    };

    payment: {
        paymentId: string;
        amount: number;
        status: string;
    };
}

export type BookingCancellationType = "user" | "admin";

export interface BookingCancelledEmailData {
    user: {
        name: string;
        email: string;
    };

    booking: {
        bookingId: string;
        tourName: string;
        travelDate: string;
        guests: number;
        totalAmount: number;
    };

    payment?: {
        paymentId: string;
        amount: number;
        status: string;
    };

    cancellationReason?: string;
}

export interface PaymentSuccessEmailData {
    name: string;
    paymentId: string;
    bookingId: string;
    tourName: string;
    travelDate: string;
    guests: number;
    amount: number;
    currency: string;
    paidAt: string;
}

export interface RefundProcessEmailData {
    user: {
        name: string;
        email: string;
    };

    payment: {
        paymentId: string;
        refundId?: string;
        refundAmount: number;
        currency?: string;
        processedAt: string;
    };
}

export interface BookingReminderEmailData {
    user: {
        name: string;
        email: string;
    };

    booking: {
        bookingId: string;
        tourName: string;
        travelDate: string;
        guests: number;
        totalAmount: number;
    };
}

export type SendEmailJobData =
    | {
          requestId?: string;
          email: string;
          type: "welcome";
          data: WelcomeEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "otp";
          data: OtpEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "password-reset";
          data: PasswordResetEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "booking-confirmed";
          data: BookingConfirmedEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "booking-cancelled-user";
          data: BookingCancelledEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "booking-cancelled-admin";
          data: BookingCancelledEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "payment-success";
          data: PaymentSuccessEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "refund-processed";
          data: RefundProcessEmailData;
      }
    | {
          requestId?: string;
          email: string;
          type: "booking-reminder";
          data: BookingReminderEmailData;
      };