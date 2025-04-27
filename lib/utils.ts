import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounced(fn: Function, delay: number = 500) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

export async function createAuthToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
      { algorithms: ["HS256"] }
    );
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export const loadLocalStorage = () => {
  try {
    if (typeof window === "undefined") {
      return undefined;
    }

    const serializedState = localStorage.getItem("persist:root");
    if (!serializedState) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading local storage:", error);
    return undefined;
  }
};

export const saveLocalStorage = (state: any) => {
  try {
    if (typeof window === "undefined") {
      return;
    }

    const serializedState = JSON.stringify(state);
    localStorage.setItem("persist:root", serializedState);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const getIntervalFormat = (interval: number) => {
  if (interval >= 3600) {
    return `${interval / 3600} hour`;
  } else if (interval > 60) {
    return `${interval / 60} minutes`;
  } else {
    return `${interval} seconds`;
  }
};
