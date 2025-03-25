import { BMI_CATEGORY } from "./bmi.const";

export interface IBmiFilters {
  id?: string;
  owner_id?: string;
  from_height?: number;
  to_height?: number;
  from_weight?: number;
  to_weight?: number;
  from_bmi_value?: number;
  to_bmi_value?: number;
  bmi_category?: BMI_CATEGORY;
  from_time?: Date;
  to_time?: Date;
}
