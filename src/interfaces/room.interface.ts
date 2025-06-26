export interface RoomInterface {
  id?: string;
  number: string;
  startTime: string;
  endTime: string;
  timeBlock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
