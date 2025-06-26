export interface BookingInterface {
  id?: string;
  date: Date;
  time: string;
  userId: string;
  roomId: string;
  status?: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}
