import User from "./User";
import UserPassword from "./UserPassword";
import Address from "./Address";
import Room from "./Room";
import Booking from "./Booking";

User.hasOne(UserPassword, {
  foreignKey: "userId",
  as: "password",
});

UserPassword.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(Address, {
  foreignKey: "userId",
  as: "address",
  constraints: false,
});

Address.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  constraints: false,
});

User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Room.hasMany(Booking, {
  foreignKey: "roomId",
  as: "bookings",
});

Booking.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});

export { User, UserPassword, Address, Room, Booking };

export default {
  User,
  UserPassword,
  Address,
  Room,
  Booking,
};
