import React, { createContext } from 'react';

const initialContext = {};

const AppContext = createContext(initialContext);
export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  const contextValue = {};

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
