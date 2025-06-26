import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { sequelize } from "../index";

interface RoomAttributes {
  id: string;
  number: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  timeBlock: number; // in minutes
  createdAt?: Date;
  updatedAt?: Date;
}
interface RoomCreationAttributes extends Optional<RoomAttributes, "id"> {}
class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes
{
  public id!: string;
  public number!: string;
  public startTime!: string;
  public endTime!: string;
  public timeBlock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeBlock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "rooms",
  }
);
export default Room;
