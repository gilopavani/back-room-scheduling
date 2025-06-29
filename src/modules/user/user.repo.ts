import {
  User as UserInterface,
  UserAddress,
  EditUser,
} from "../../interfaces/User.interface";
import { User, UserPassword, Address } from "../../database/models";
import { Transaction, Op } from "sequelize";
import {
  PaginationParams,
  FilterParams,
  createPaginationResult,
  PaginationResult,
} from "../../utils/pagination";

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

  getAllUsersWithPagination: async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<UserAddress>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const {
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: new Date(endDate),
      };
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return createPaginationResult(rows, count, page, limit);
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
