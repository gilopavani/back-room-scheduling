interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs: boolean;
  canManageScheduling: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  hasPermission(permission: "logs" | "scheduling"): boolean;
}

export { User };
