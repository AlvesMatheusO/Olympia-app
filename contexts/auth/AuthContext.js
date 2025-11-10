import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Alert foi removido daqui

export const API_BASE_URL = "https://tqqtsjl1-8000.brs.devtunnels.ms/";

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
      const response = await fetch(`${API_BASE_URL}api/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login Response Status:", response.status);

      if (!response.ok) {
        // Lança o erro para a tela de Login
        throw new Error("Usuário ou senha inválidos");
      }

      const data = await response.json();

      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      await AsyncStorage.setItem("accessToken", data.access);
      await AsyncStorage.setItem("refreshToken", data.refresh);

      return data.access;
    } catch (e) {
      // Relança o erro para que a tela (LoginScreen) possa pegá-lo
      throw e;
    }
  };

  // Função de Cadastro (MODIFICADA PARA LANÇAR ERROS E RETORNAR STATUS)
  const signUp = async (userRegistrationData, userGoalData) => {
    let localAccessToken = null;

    try {
      // --- PASSO 1: Registrar o Usuário ---
      const responseUser = await fetch(`${API_BASE_URL}api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegistrationData),
      });

      console.log("Register Response Status:", responseUser.status);

      if (!responseUser.ok) {
        const errorData = await responseUser.json();
        let errorMessage = "🐞";
        if (errorData.username) {
          errorMessage += `Email: ${errorData.username[0]}`;
        } else if (errorData.email) {
          errorMessage += `Email: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMessage += `Senha: ${errorData.password[0]}`;
        } else {
          errorMessage += "Verifique os dados e tente novamente.";
        }
        // Lança o erro para a RegisterScreen
        throw new Error(errorMessage);
      }

      console.log("Cadastro de usuário bem-sucedido.");

      // --- PASSO 2: Fazer Login para obter o Token ---
      localAccessToken = await signIn(
        userRegistrationData.email,
        userRegistrationData.password
      );

      if (!localAccessToken) {
        throw new Error("Cadastro realizado, mas o login automático falhou.");
      }

      console.log("Login automático bem-sucedido.");

      // --- PASSO 3: Criar a Meta ---
      const responseGoal = await fetch(`${API_BASE_URL}api/goals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localAccessToken}`,
        },
        body: JSON.stringify(userGoalData),
      });

      console.log("Goal Response Status:", responseGoal.status);

      if (!responseGoal.ok) {
        const errorGoalData = await responseGoal.json();
        console.warn(
          "Usuário criado e logado, mas falha ao criar meta:",
          errorGoalData
        );
        
        // Retorna sucesso, mas com um aviso
        return {
          success: true,
          warning:
            "Sua conta foi criada, mas não foi possível salvar sua meta inicial. Você pode defini-la novamente no seu perfil.",
        };
      }

      console.log("Meta criada com sucesso.");

      // Retorna sucesso total
      return { success: true, warning: null };

    } catch (e) {
      // Relança qualquer erro (do Passo 1 ou 2) para a RegisterScreen
      throw e;
    }
  };

  // Função de Logout
  const signOut = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        accessToken,
        refreshToken,
        isLoading,
        isSignedIn: accessToken !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado
export const useAuth = () => {
  return useContext(AuthContext);
};