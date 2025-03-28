export const HOST=import.meta.env.VITE_API_HOST;

export const TOURS='tour';
export const GET_TOUR=`${HOST}/${TOURS}`;
export const GET_TOUR_DETAIL=`${HOST}/${TOURS}/data`

export const AUTH='auth';
export const SIGNUP=`${HOST}/${AUTH}/signup`;
export const LOGIN=`${HOST}/${AUTH}/login`;

export const UPDATE_PROFILE=`${HOST}/auth/user/profile`

export const BLOG='blog';
export const GET_BLOG=`${BLOG}`;

export const BOOKING=`booking`;
export const CREATE_BOOKING=`${HOST}/${BOOKING}`
export const UPDATE_BOOKING=`${HOST}/${BOOKING}`
export const CANCEL_BOOKING=`${HOST}/${BOOKING}`
export const GET_BOOKING=`${HOST}/${BOOKING}/user`