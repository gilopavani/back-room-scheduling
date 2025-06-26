import {
  User as UserInterface,
  UserAddress,
  EditUser,
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
          model: Address,
          as: "address",
        },
      ],
    });
  },

  findUserById: async (id: string): Promise<User | null> => {
    return await User.findByPk(id, {
      include: [
        {
          model: Address,
          as: "address",
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

  updateUserProfile: async (
    userId: string,
    userData: EditUser
  ): Promise<{
    user: User;
    address?: Address;
  } | null> => {
    const sequelize = User.sequelize;
    const transaction: Transaction = await sequelize!.transaction();
    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        return null;
      }
      user.name = userData.user.name || user.name;
      user.lastName = userData.user.lastName || user.lastName;
      user.email = userData.user.email;
      await user.save({ transaction });
      let updatedAddress: Address | undefined;
      if (userData.address) {
        const address = await Address.findOne({
          where: { userId: user.id },
          transaction,
        });
        if (address) {
          address.cep = userData.address.cep || address.cep;
          address.number = userData.address.number || address.number;
          address.street = userData.address.street || address.street;
          address.neighborhood =
            userData.address.neighborhood || address.neighborhood;
          address.city = userData.address.city || address.city;
          address.state = userData.address.state || address.state;
          await address.save({ transaction });
          updatedAddress = address;
        }
      }
      if (userData.password) {
        const userPassword = await UserPassword.findOne({
          where: { userId: user.id },
          transaction,
        });
        if (userPassword) {
          userPassword.passwordHash = userData.password;
          await userPassword.save({ transaction });
        }
      }
      const updatedUser: {
        user: User;
        address?: Address;
      } = {
        user,
        address: updatedAddress,
      };
      await transaction.commit();
      return updatedUser;
    } catch (error) {
      if (sequelize) {
        const transaction: Transaction = await sequelize.transaction();
        await transaction.rollback();
      }
      throw error;
    }
  },
};

export default userRepo;
