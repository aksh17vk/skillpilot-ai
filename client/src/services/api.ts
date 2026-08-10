const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] || "http://localhost:5000/api/v1").replace(/\/$/, "");

export type ApiResponse<T = unknown> = {
  statusCode?: number;
  data?: T;
  message?: string;
  success?: boolean;
};

export function getToken() {
  return localStorage.getItem("skillpilot_access_token");
}

export function setToken(token: string) {
  localStorage.setItem("skillpilot_access_token", token);
}

export function clearToken() {
  localStorage.removeItem("skillpilot_access_token");
}

function unwrap<T>(payload: any): T {
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearToken();
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.message
        ? payload.message
        : typeof payload === "string" && payload
          ? payload
          : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return unwrap<T>(payload);
}

export const api = {
  login: (email: string, password: string) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (fullName: string, email: string, password: string) =>
    request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password }),
    }),

  getMe: () => request<any>("/auth/me"),

  getProfile: () => request<any>("/profile"),

  updateProfile: (profileData: any) =>
    request<any>("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  getDashboard: () => request<any>("/dashboard"),

  uploadResume: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<any>("/resume/upload", { method: "POST", body: form });
  },

  getLatestResume: () => request<any>("/resume/latest"),

  analyzeJob: (jobDescription: string, roleTitle?: string) =>
    request<any>("/jobs/analyze", {
      method: "POST",
      body: JSON.stringify({ jobDescription, ...(roleTitle ? { roleTitle } : {}) }),
    }),

  getLatestJob: () => request<any>("/jobs/latest"),

  getSkillGap: () => request<any>("/skill-gap/analyze"),

  generateRoadmap: (payload: {
    mode: "auto" | "manual";
    targetRole: string;
    currentSkills?: string[];
    missingSkills?: string[];
    dailyHours: number;
    preferredStudyTime: string;
    daysPerWeek: number;
    durationDays: number;
  }) =>
    request<any>("/roadmap/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getLatestRoadmap: () => request<any>("/roadmap/latest"),

  downloadRoadmapPdf: (roadmapPayload: unknown) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/roadmap/download-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(roadmapPayload),
    });
  },

  chat: (message: string) =>
    request<any>("/career-assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
