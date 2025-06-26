export interface LogInterface {
  id?: string;
  userId: string;
  module: "account" | "booking";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

export interface CreateLog {
  userId: string;
  module: "account" | "booking";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
