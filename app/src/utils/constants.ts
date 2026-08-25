export const HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:4000";

export const AUTH = "auth";
export const LOGIN_URL = `${AUTH}/login`;
export const SIGNUP_URL = `${AUTH}/signup`;
export const LOGOUT_URL = `${AUTH}/logout`;
export const GET_PROFILE_URL = `${AUTH}/me`;
export const UPDATE_PROFILE_URL = `${AUTH}/me`;
export const DELETE_PROFILE_URL = `${AUTH}/me`;

export const BLOG = "blog";
export const GET_BLOG_URL = (page = 1, limit = 10) => `${BLOG}?page=${page}&limit=${limit}`;
export const GET_BLOG_BY_ID_URL = (id: string) => `${BLOG}/${id}`;
export const CREATE_BLOG_URL = `${BLOG}`;
export const UPDATE_BLOG_URL = (id: string) => `${BLOG}/${id}`;
export const DELETE_BLOG_URL = (id: string) => `${BLOG}/${id}`;

export const BOOKING = "booking";
export const GET_BOOKING_URL = (page = 1, limit = 10) => `${BOOKING}?page=${page}&limit=${limit}`;
export const GET_BOOKING_DETAIL_URL = (tourId: string) => `${BOOKING}/${tourId}`;
export const CREATE_BOOKING_URL = `${BOOKING}`;
export const ACCEPT_BOOKING_URL = `${BOOKING}/accept`;
export const CANCEL_BOOKING_URL = (tourId: string, all: boolean) => `${BOOKING}/${tourId}?all=${all}`;

export const CONTACT = "contact";
export const GET_CONTACT_URL = (page = 1, limit = 10) => `${CONTACT}?page=${page}&limit=${limit}`;
export const CREATE_CONTACT_URL = `${CONTACT}`;
export const DELETE_CONTACT_URL = (id: string) => `${CONTACT}/${id}`;

export const PAYMENT = "payment";
export const CREATE_ORDER_URL = `${PAYMENT}/create-order`;
export const VERIFY_ORDER_URL = `${PAYMENT}/verify-order`;
export const REFUND_URL = `${PAYMENT}/refund`;
export const GET_PAYMENT_HISTORY_URL = `${PAYMENT}/payment-history`;

export const REVIEW = "review";
export const GET_REVIEW_URL = (page = 1, limit = 10) => `${REVIEW}?page=${page}&limit=${limit}`;
export const CREATE_REVIEW_URL = `${REVIEW}`;
export const UPDATE_REVIEW_URL = (id: string) => `${REVIEW}/${id}`;
export const DELETE_REVIEW_URL = (id: string) => `${REVIEW}/${id}`;

export const HOTEL = "hotel";
export const GET_HOTEL_URL = (page = 1, limit = 10) => `${HOTEL}?page=${page}&limit=${limit}`;
export const GET_HOTEL_DETAIL_URL = (id: string) => `${HOTEL}/${id}`;
export const CREATE_HOTEL_URL = `${HOTEL}`;
export const UPDATE_HOTEL_URL = (id: string) => `${HOTEL}/${id}`;
export const DELETE_HOTEL_URL = (id: string) => `${HOTEL}/${id}`;

export const TOUR = "tour";
export const GET_TOUR_URL = (page = 1, limit = 10) => `${TOUR}?page=${page}&limit=${limit}`;
export const GET_TOUR_DETAIL_URL = (id: string) => `${TOUR}/${id}`;
export const CREATE_TOUR_URL = `${TOUR}`;
export const UPDATE_TOUR_URL = (id: string) => `${TOUR}/${id}`;
export const DELETE_TOUR_URL = (id: string) => `${TOUR}/${id}`;

export const LOG = "logs";
export const GET_LOG_URL = (page = 1, limit = 10) => `${LOG}?page=${page}&limit=${limit}`;

export const CATEGORY = "category";
export const GET_CATEGORY_URL = (page = 1, limit = 10) => `${CATEGORY}?page=${page}&limit=${limit}`;
export const CREATE_CATEGORY_URL = `${CATEGORY}`;
export const UPDATE_CATEGORY_URL = (id: string) => `${CATEGORY}/${id}`;
export const DELETE_CATEGORY_URL = (id: string) => `${CATEGORY}/${id}`;
export const GET_CATEGORY_BY_ID_URL = (id: string) => `${CATEGORY}/${id}`;