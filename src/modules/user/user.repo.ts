import {
  User as UserInterface,
  UserAddress,
} from "../../interfaces/User.interface";
import { User, UserPassword, Address } from "../../database/models";
import { Transaction } from "sequelize";

const userRepo = {
  getAllUsers: async (): Promise<UserAddress[]> => {
    return await User.findAll({
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });
  },

  findUserByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: UserPassword,
          as: "password",
        },
      ],
    });
  },

  findUserById: async (id: string): Promise<User | null> => {
    return await User.findByPk(id, {
      include: [
        {
          model: UserPassword,
          as: "password",
        },
      ],
    });
  },

  findPermissionsByUserId: async (
    userId: string
  ): Promise<UserInterface | null> => {
    return await User.findByPk(userId, {
      attributes: ["id", "canViewLogs", "canManageScheduling"],
    });
  },

  editUserPermissions: async (
    userId: string,
    permissions: { canViewLogs?: boolean; canManageScheduling?: boolean }
  ): Promise<User | null> => {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    console.log("Editing permissions for user:", userId, user);
    if (user.role === "admin") {
      throw new Error("Cannot edit permissions for admin users");
    }
    if (permissions.canViewLogs !== undefined) {
      user.canViewLogs = permissions.canViewLogs;
    }
    if (permissions.canManageScheduling !== undefined) {
      user.canManageScheduling = permissions.canManageScheduling;
    }
    await user.save();
    return user;
  },

  findActiveUserByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({
      where: {
        email,
        status: "active",
      },
      include: [
        {
          model: UserPassword,
          as: "password",
        },
      ],
    });
  },
};

export default userRepo;
