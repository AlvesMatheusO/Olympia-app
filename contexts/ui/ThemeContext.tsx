import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Appearance } from "react-native";

export type Theme = "light" | "dark";

export interface ThemeContextData {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData>({
  theme: "dark",
  toggleTheme: () => {"dark"},
});

interface Props {
  children: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  // 👉 Se quiser respeitar o sistema, mas cair para dark se não houver valor
  const systemTheme = Appearance.getColorScheme() as Theme;
  const [theme, setTheme] = useState<Theme>(systemTheme || "dark");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setTheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
