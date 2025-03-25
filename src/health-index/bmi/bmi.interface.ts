import { BMI_CATEGORY } from "./bmi.const";

export interface IBmiFilters {
  id?: string;
  owner_id?: string;
  height?: number;
  weight?: number;
  bmi_value?: number;
  bmi_category?: BMI_CATEGORY;
  from_time?: Date;
  to_time?: Date;
}
