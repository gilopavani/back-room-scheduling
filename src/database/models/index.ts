import User from "./User";
import UserPassword from "./UserPassword";
import Address from "./Address";

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

export { User, UserPassword, Address };

export default {
  User,
  UserPassword,
  Address,
};
