import api from "./api";

// ── Types ──
export interface Address {
  id: number;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  town: string;
  address: string;
  landmark: string | null;
  isDefault: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
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

export interface UpdateAddressPayload {
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

// ── Service ──
export const addressService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get("/addresses");
    return response.data.data;
  },

  async getById(id: number): Promise<Address> {
    const response = await api.get(`/addresses/${id}`);
    return response.data.data;
  },

  async create(data: CreateAddressPayload): Promise<Address> {
    const response = await api.post("/addresses", data);
    return response.data.data;
  },

  async update(id: number, data: UpdateAddressPayload): Promise<Address> {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data.data;
  },

  async setDefault(id: number): Promise<Address> {
    const response = await api.put(`/addresses/${id}/default`);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};

