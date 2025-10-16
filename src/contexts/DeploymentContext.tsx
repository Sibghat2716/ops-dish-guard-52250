import { createContext, useContext, useState, ReactNode } from "react";

export interface ChangeLogEntry {
  id: string;
  type: "product" | "recipe" | "identifier" | "ingredient" | "coupon";
  action: "created" | "updated" | "deleted";
  itemName: string;
  description: string;
  timestamp: Date;
}

export interface DeploymentHistory {
  id: string;
  environment: "sandbox" | "production";
  status: "pending" | "in-progress" | "success" | "failed";
  timestamp: Date;
  changesCount: number;
  changes: ChangeLogEntry[];
  targetStores?: string[];
  duration?: number;
  deployedBy: string;
  logs: string[];
}

interface DeploymentContextType {
  changes: ChangeLogEntry[];
  addChange: (change: Omit<ChangeLogEntry, "id" | "timestamp">) => void;
  clearChanges: () => void;
  hasChanges: boolean;
  newProductsCount: number;
  addNewProducts: (count: number) => void;
  clearNewProducts: () => void;
  deploymentHistory: DeploymentHistory[];
  addDeployment: (deployment: Omit<DeploymentHistory, "id" | "timestamp" | "logs">) => string;
  updateDeploymentStatus: (id: string, status: DeploymentHistory["status"], logs?: string[], duration?: number) => void;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(
  undefined
);

export const DeploymentProvider = ({ children }: { children: ReactNode }) => {
  const [changes, setChanges] = useState<ChangeLogEntry[]>([]);
  const [newProductsCount, setNewProductsCount] = useState(0);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);

  const addChange = (change: Omit<ChangeLogEntry, "id" | "timestamp">) => {
    const newChange: ChangeLogEntry = {
      ...change,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    setChanges((prev) => [...prev, newChange]);
  };

  const clearChanges = () => {
    setChanges([]);
  };

  const addNewProducts = (count: number) => {
    setNewProductsCount((prev) => prev + count);
  };

  const clearNewProducts = () => {
    setNewProductsCount(0);
  };

  const addDeployment = (deployment: Omit<DeploymentHistory, "id" | "timestamp" | "logs">) => {
    const newDeployment: DeploymentHistory = {
      ...deployment,
      id: `deployment-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      logs: ["Deployment initiated..."],
    };
    setDeploymentHistory((prev) => [newDeployment, ...prev]);
    return newDeployment.id;
  };

  const updateDeploymentStatus = (
    id: string,
    status: DeploymentHistory["status"],
    logs?: string[],
    duration?: number
  ) => {
    setDeploymentHistory((prev) =>
      prev.map((deployment) =>
        deployment.id === id
          ? {
              ...deployment,
              status,
              logs: logs ? [...deployment.logs, ...logs] : deployment.logs,
              duration: duration !== undefined ? duration : deployment.duration,
            }
          : deployment
      )
    );
  };

  const hasChanges = changes.length > 0;

  return (
    <DeploymentContext.Provider
      value={{
        changes,
        addChange,
        clearChanges,
        hasChanges,
        newProductsCount,
        addNewProducts,
        clearNewProducts,
        deploymentHistory,
        addDeployment,
        updateDeploymentStatus,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};

export const useDeployment = () => {
  const context = useContext(DeploymentContext);
  if (!context) {
    throw new Error("useDeployment must be used within DeploymentProvider");
  }
  return context;
};
