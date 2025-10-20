import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ASSUMindo que seu backend roda no mesmo IP de antes
const API_BASE_URL = "https://tqqtsjl1-8000.brs.devtunnels.ms/";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar os tokens do storage ao iniciar o app
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedAccess = await AsyncStorage.getItem("accessToken");
        const storedRefresh = await AsyncStorage.getItem("refreshToken");

        if (storedAccess && storedRefresh) {
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          // Aqui você poderia adicionar uma lógica para verificar se o token de acesso ainda é válido
        }
      } catch (e) {
        console.error("Failed to load tokens from storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  // Função de Login
  const signIn = async (username, password) => {
    try {
      // !! MUDE ESTA URL se o seu endpoint de login for diferente !!
      const response = await fetch(`https://tqqtsjl1-8000.brs.devtunnels.ms/api/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }

      const data = await response.json();
      
      // Salva os tokens no estado
      setAccessToken(data.access);
      setRefreshToken(data.refresh);

      // Salva os tokens no AsyncStorage
      await AsyncStorage.setItem("accessToken", data.access);
      await AsyncStorage.setItem("refreshToken", data.refresh);

      return true; // Sucesso
    } catch (e) {
      console.error("Erro no login:", e);
      return false; // Falha
    }
  };

  // Função de Logout
  const signOut = async () => {
    // Limpa o estado
    setAccessToken(null);
    setRefreshToken(null);

    // Limpa o AsyncStorage
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        accessToken,
        refreshToken,
        isLoading,
        isSignedIn: accessToken !== null, // Um booleano para facilitar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};