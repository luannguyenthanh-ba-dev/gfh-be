import { USER_ROLES } from "src/common/utils/constants.util";

export interface IUserFilters {
  id?: string;
  auth0_user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: USER_ROLES;
}
