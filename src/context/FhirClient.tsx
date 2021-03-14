import React, { FC, createContext, useContext, ReactNode } from "react";

interface FHIRClientProviderProps {
  client: any;
  children: ReactNode;
}

export const FHIRClientContext = createContext(null);

export const FHIRClientProvider: FC<FHIRClientProviderProps> = ({
  client,
  children,
}) => {
  return (
    <FHIRClientContext.Provider value={client}>
      {children}
    </FHIRClientContext.Provider>
  );
};

export const useFHIRClient = (): any => useContext(FHIRClientContext);
