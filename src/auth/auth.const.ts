export const ROLES_KEY = 'roles';
export const ANY_USER = 'any_user';
export const AUTH0_API = {
  OAUTH_TOKEN: (domain) => {
    return `https://${domain}/oauth/token`;
  },
  AUTH0_SIGNUP: (domain) => {
    return `https://${domain}/dbconnections/signup`;
  },
  USER_INFO: (domain) => {
    return `https://${domain}/userinfo`;
  },
};

export const grant_type = {
  password: "password",
  refresh_token: "refresh_token",
};
