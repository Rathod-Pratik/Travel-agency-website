export const HOST=import.meta.env.VITE_API_HOST;

export const TOURS='tour';

export const GET_TOUR=`${HOST}/${TOURS}`;

export const AUTH='auth';

export const SIGNUP=`${HOST}/${AUTH}/signup`;
export const LOGIN=`${HOST}/${AUTH}/login`;