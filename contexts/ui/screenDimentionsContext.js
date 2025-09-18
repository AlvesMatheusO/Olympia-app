import React from "react";
import { Dimensions } from "react-native";

const ScreenDimensionsContext = React.createContext();

export const ScreenDimensionsProvider = ({ children }) => {
  const { width, height } = Dimensions.get("window");

  return (
    <ScreenDimensionsContext.Provider
      value={{
        width,
        height,
      }}
    >
      {children}
    </ScreenDimensionsContext.Provider>
  );
};

export const useScreenDimensions = () => {
  const context = React.useContext(ScreenDimensionsContext);
  if (!context) {
    throw new Error(
      "useScreenDimensions must be used within a ScreenDimensionsProvider"
    );
  }
  return context;
};
