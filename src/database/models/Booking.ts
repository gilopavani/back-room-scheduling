import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface BookingAttributes {
  id: string;
  date: string; // ISO 8601 format
  time: string; // ISO 8601 format
  userId: string; // Foreign key to User
  roomId: string; // Foreign key to Room
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}
interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> {}
class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: string;
  public date!: string;
  public time!: string;
  public userId!: string;
  public roomId!: string;
  public status!: "pending" | "confirmed" | "cancelled";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
  }
);
export default Booking;
