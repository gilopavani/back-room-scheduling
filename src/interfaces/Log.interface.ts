export interface LogInterface {
  id?: string;
  userId: string;
  module: "auth" | "me" | "booking" | "user" | "room";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

export interface CreateLog {
  userId: string;
  module: "auth" | "me" | "booking" | "user" | "room";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
