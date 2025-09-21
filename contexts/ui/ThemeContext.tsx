import React, { createContext, useState, useEffect, ReactNode } from "react";

import { Appearance, ColorSchemeName } from 'react-native';

export type Theme = 'light' | 'dark';

export interface ThemeContextData {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData>({
    theme: 'dark',
    toggleTheme: () => {},
});

interface Props {
    children: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {

    const systemTheme = Appearance.getColorScheme() as Theme;
    const [ theme, setTheme ] = useState<Theme>(systemTheme || 'light');

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorScheme) {
                setTheme(colorScheme);
            }
        });
        return () => subscription.remove();
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};