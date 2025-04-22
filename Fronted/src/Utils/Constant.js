export const HOST=import.meta.env.VITE_API_HOST;

export const TOURS='tour';
export const GET_TOUR=`${TOURS}`;
export const GET_TOUR_DETAIL=`${TOURS}/data`
export const CREATE_TOUR=`${TOURS}`
export const UPDATE_TOUR=`${TOURS}`
export const DELETE_TOUR=`${TOURS}`

export const AUTH='auth';
export const SIGNUP=`${AUTH}/signup`;
export const LOGIN=`${AUTH}/login`;
export const LOGOUT=`${AUTH}/logout`;
export const UPDATE_PROFILE=`auth/user/profile`
export const GET_USER='/Admin/getuser'
export const REMOVE_USER='/Admin/reomveusers'
export const GET_ALL_STATE=`/Admin/stats`

export const BLOG='blog';
export const GET_BLOG=`${BLOG}`;
export const CREATE_BLOG=`${BLOG}/create`
export const UPDATE_BLOG=`${BLOG}/update`
export const DELETE_BLOG=`${BLOG}/delete`

export const BOOKING=`booking`;
export const CREATE_BOOKING=`${BOOKING}`
export const UPDATE_BOOKING=`${BOOKING}`
export const CANCEL_BOOKING=`${BOOKING}`
export const GET_BOOKING=`${BOOKING}/user`
export const GET_CANCEL_BOOKING=`${BOOKING}/user/cancel`
export const GET_ALL_BOOKING=`${BOOKING}/getallbooking`
export const DELETE_BOOKING=`${BOOKING}/deletebooking`

export const ADD_REVIEW=`reviews`;
export const GET_REVIEW=`reviews`;
export const GET_ALL_REVIEW=`reviews`
export const DELETE_REVIEW=`reviews/DeleteReview`;

export const ADD_CONTECT="contact/AddContact"
export const GET_CONTECT="contact/GetContact"
export const DELETE_CONTECT="contact/DeleteContact"