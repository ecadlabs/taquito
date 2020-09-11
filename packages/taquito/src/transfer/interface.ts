import { Estimate } from "../contract/estimate";

/**
 * @description Transfer interface for providing transfer utilities
 */
export interface Transfer {
    /**
     * @description Return transfer estimate
     */
    estimate(): Promise<Estimate>;
  }
  