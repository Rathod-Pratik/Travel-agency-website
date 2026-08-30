export interface InvoiceCustomer {
    name: string;
    email: string;
    phone: string;
}

export interface InvoiceTraveller {
    name: string;
    age: number;
    document: string;
}

export interface InvoiceTour {
    name: string;
    destination: {
        city: string;
        country: string;
    };
    startDate: string;
    endDate: string;
    duration: {
        days: number;
        nights: number;
    };
}

export interface InvoicePayment {
    paymentId: string;
    paymentMethod: string;
    status: string;
}

export interface InvoiceJobData {
    invoiceNumber: string;
    invoiceDate: string;

    booking: {
        bookingDate: string;
        status: string;
        numberOfSeats: number;
    };

    customer: InvoiceCustomer;

    traveller: InvoiceTraveller[];

    tour: InvoiceTour;

    payment: InvoicePayment;

    amount: number;

    company: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
        website?: string;
    };
}