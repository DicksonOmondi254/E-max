import { prisma } from "../config/prisma";

export interface CreateAddressInput {
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  town: string;
  address: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  label?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  county?: string;
  town?: string;
  address?: string;
  landmark?: string;
  isDefault?: boolean;
}

export const addressService = {
  // ── Get all addresses for a user ──
  async getAllByUser(userId: number) {
    return prisma.customerAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  // ── Get single address ──
  async getById(id: number, userId: number) {
    const address = await prisma.customerAddress.findFirst({
      where: { id, userId },
    });
    if (!address) throw new Error("Address not found.");
    return address;
  },

  // ── Create address ──
  async create(userId: number, data: CreateAddressInput) {
    // If this is the first address or marked as default, unset other defaults
    if (data.isDefault) {
      await prisma.customerAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default automatically
    const existingCount = await prisma.customerAddress.count({ where: { userId } });
    const makeDefault = existingCount === 0 ? true : data.isDefault ?? false;

    return prisma.customerAddress.create({
      data: {
        label: data.label || "Home",
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        county: data.county,
        town: data.town,
        address: data.address,
        landmark: data.landmark || null,
        isDefault: makeDefault,
        userId,
      },
    });
  },

  // ── Update address ──
  async update(id: number, userId: number, data: UpdateAddressInput) {
    const existing = await prisma.customerAddress.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error("Address not found.");

    // If setting as default, unset others
    if (data.isDefault) {
      await prisma.customerAddress.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return prisma.customerAddress.update({
      where: { id },
      data: {
        ...(data.label !== undefined && { label: data.label }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.county !== undefined && { county: data.county }),
        ...(data.town !== undefined && { town: data.town }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.landmark !== undefined && { landmark: data.landmark || null }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
      },
    });
  },

  // ── Set default address ──
  async setDefault(id: number, userId: number) {
    const existing = await prisma.customerAddress.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error("Address not found.");

    // Unset all defaults for this user
    await prisma.customerAddress.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set the chosen one
    return prisma.customerAddress.update({
      where: { id },
      data: { isDefault: true },
    });
  },

  // ── Delete address ──
  async delete(id: number, userId: number) {
    const existing = await prisma.customerAddress.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error("Address not found.");

    await prisma.customerAddress.delete({ where: { id } });

    // If we deleted the default, assign default to the next most recent
    if (existing.isDefault) {
      const nextAddress = await prisma.customerAddress.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (nextAddress) {
        await prisma.customerAddress.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: "Address deleted successfully." };
  },
};

