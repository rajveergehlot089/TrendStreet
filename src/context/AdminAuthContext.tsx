"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminAccessRecord } from "@/types/store";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  adminName: string;
  login: (id: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  accessRegister: AdminAccessRecord[];
  updateAccessRecord: (record: AdminAccessRecord) => void;
  addAccessRecord: (record: Omit<AdminAccessRecord, "adminId">) => void;
  deleteAccessRecord: (adminId: number) => void;
}

const INITIAL_ACCESS_REGISTER: AdminAccessRecord[] = [
  {
    adminId: 1,
    systemOrTool: "Trend Street Core Storefront & CMS",
    category: "Operations",
    mainAdmin: "Sujal Solanki",
    backupAdmin: "Radha Solanki",
    department: "Executive & Commerce",
    accessLevel: "Full",
    numberOfAdminUsers: 2,
    billingOwner: "Sujal Solanki",
    plan: "Enterprise Atelier Tier",
    seats: 5,
    renewalDate: "2027-01-15",
    companyOwnedAccount: true,
    sharedLogin: false,
    passwordManagerEntry: "1Password Atelier Vault / Trend Street Root",
    twoFactorOn: true,
    lastAccessReview: "2026-10-01",
    nextAccessReview: "2027-01-01",
    offboardingChecklistItem: "Revoke master tokens, cycle API credentials, invalidate active sessions",
    riskLevel: "Low",
    status: "Provisioned",
    notes: "Primary root administrator credentials. Multi-factor authenticated with hardware passkey.",
  },
  {
    adminId: 2,
    systemOrTool: "Logistics & Global Courier Fulfillment",
    category: "Operations",
    mainAdmin: "Sujal Solanki",
    backupAdmin: "Operations Dispatch Lead",
    department: "Supply Chain",
    accessLevel: "Full",
    numberOfAdminUsers: 3,
    billingOwner: "Trend Street Atelier Ltd",
    plan: "Global Freight Pro",
    seats: 6,
    renewalDate: "2027-03-30",
    companyOwnedAccount: true,
    sharedLogin: false,
    passwordManagerEntry: "1Password Atelier Vault / Courier API",
    twoFactorOn: true,
    lastAccessReview: "2026-09-15",
    nextAccessReview: "2026-12-15",
    offboardingChecklistItem: "Revoke carrier dispatch rights, cancel handheld API keys",
    riskLevel: "Low",
    status: "Provisioned",
    notes: "Connected to worldwide carbon-neutral express courier services.",
  },
  {
    adminId: 3,
    systemOrTool: "Stripe & Merchant Banking Gateway",
    category: "Finance",
    mainAdmin: "Sujal Solanki",
    backupAdmin: "Chief Financial Officer",
    department: "Finance",
    accessLevel: "Full",
    numberOfAdminUsers: 2,
    billingOwner: "Sujal Solanki",
    plan: "Merchant Tier 1",
    seats: 2,
    renewalDate: "2027-06-01",
    companyOwnedAccount: true,
    sharedLogin: false,
    passwordManagerEntry: "Hardware YubiKey Vault",
    twoFactorOn: true,
    lastAccessReview: "2026-10-10",
    nextAccessReview: "2027-01-10",
    offboardingChecklistItem: "Immediate payout block, revoke API secret keys, mandate biometric re-auth",
    riskLevel: "Critical",
    status: "Provisioned",
    notes: "Handles high-value luxury card processing, multi-currency settlements, and fraud shielding.",
  },
];

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [accessRegister, setAccessRegister] = useState<AdminAccessRecord[]>(INITIAL_ACCESS_REGISTER);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem("ts_admin_auth");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.authenticated && parsed.email) {
          setIsAuthenticated(true);
          setAdminEmail(parsed.email);
        }
      }

      const storedRegister = localStorage.getItem("ts_access_register");
      if (storedRegister) {
        setAccessRegister(JSON.parse(storedRegister));
      }
    } catch (e) {
      console.error("Failed to load admin auth:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ts_access_register", JSON.stringify(accessRegister));
    } catch (e) {
      console.error("Failed to persist access register:", e);
    }
  }, [accessRegister, isHydrated]);

  const login = (id: string, pass: string): { success: boolean; message: string } => {
    const trimmedId = id.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // User specified credentials:
    // admin panel id: sujal@.com
    // password: radhasolanki
    if (trimmedId === "sujal@.com" && trimmedPass === "radhasolanki") {
      setIsAuthenticated(true);
      setAdminEmail(trimmedId);
      localStorage.setItem(
        "ts_admin_auth",
        JSON.stringify({ authenticated: true, email: trimmedId, timestamp: Date.now() })
      );
      return { success: true, message: "Welcome back, Sujal Solanki. Authentication successful." };
    }

    return { success: false, message: "Invalid credentials. Please verify your Admin ID and Password." };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem("ts_admin_auth");
  };

  const updateAccessRecord = (record: AdminAccessRecord) => {
    setAccessRegister((prev) =>
      prev.map((r) => (r.adminId === record.adminId ? record : r))
    );
  };

  const addAccessRecord = (recordInput: Omit<AdminAccessRecord, "adminId">) => {
    const newRecord: AdminAccessRecord = {
      ...recordInput,
      adminId: Date.now(),
    };
    setAccessRegister((prev) => [...prev, newRecord]);
  };

  const deleteAccessRecord = (adminId: number) => {
    setAccessRegister((prev) => prev.filter((r) => r.adminId !== adminId));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminEmail,
        adminName: "Sujal Solanki",
        login,
        logout,
        accessRegister,
        updateAccessRecord,
        addAccessRecord,
        deleteAccessRecord,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
