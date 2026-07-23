const API_URL = "http://localhost:5000/api/auth";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let result: any;

    try {
      result = await response.json();
    } catch {
      throw new Error("Unable to read server response.");
    }

    console.log("Login Response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Login failed.");
    }

    if (result.token) {
      localStorage.setItem("token", result.token);
    }

    return result;
  },

  async register(data: RegisterData) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let result: any;

    try {
      result = await response.json();
    } catch {
      throw new Error("Unable to read server response.");
    }

    console.log("Registration Response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Registration failed.");
    }

    return result;
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    let result: any;

    try {
      result = await response.json();
    } catch {
      throw new Error("Unable to read server response.");
    }

    if (!response.ok) {
      throw new Error(result.message || "Failed to process request.");
    }

    return result;
  },

  async resetPassword(token: string, password: string) {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    let result: any;

    try {
      result = await response.json();
    } catch {
      throw new Error("Unable to read server response.");
    }

    if (!response.ok) {
      throw new Error(result.message || "Failed to reset password.");
    }

    return result;
  },

  logout() {
    localStorage.removeItem("token");
  },
};
