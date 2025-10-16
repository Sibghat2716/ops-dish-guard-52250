import { createContext, useContext, useState } from "react";

const DeploymentContext = createContext(undefined);

export const DeploymentProvider = ({ children }) => {
  const [changes, setChanges] = useState([]);
  const [newProductsCount, setNewProductsCount] = useState(0);
  const [deploymentHistory, setDeploymentHistory] = useState([]);

  const addChange = (change) => {
    const newChange = {
      ...change,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    setChanges((prev) => [...prev, newChange]);
  };

  const clearChanges = () => {
    setChanges([]);
  };

  const addNewProducts = (count) => {
    setNewProductsCount((prev) => prev + count);
  };

  const clearNewProducts = () => {
    setNewProductsCount(0);
  };

  const addDeployment = (deployment) => {
    const newDeployment = {
      ...deployment,
      id: `deployment-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      logs: ["Deployment initiated..."],
    };
    setDeploymentHistory((prev) => [newDeployment, ...prev]);
    return newDeployment.id;
  };

  const updateDeploymentStatus = (
    id,
    status,
    logs,
    duration
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
