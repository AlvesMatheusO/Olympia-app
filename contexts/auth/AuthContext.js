import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

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
        // No login, podemos ser mais diretos
        throw new Error("Usuário ou senha inválidos");
      }

      const data = await response.json();

      // Salva os tokens no estado
      setAccessToken(data.access);
      setRefreshToken(data.refresh);

      // Salva os tokens no AsyncStorage
      await AsyncStorage.setItem("accessToken", data.access);
      await AsyncStorage.setItem("refreshToken", data.refresh);

      // Retorna o token de acesso para ser usado imediatamente se necessário
      return data.access;
    } catch (e) {
      console.error("Erro no login:", e);
      // Lança o erro para que a função chamadora (como signUp) possa pegá-lo
      throw e;
    }
  };

  // Função de Cadastro (MODIFICADA)
  const signUp = async (userRegistrationData, userGoalData) => {
    let createdUser = null;
    let localAccessToken = null;

    try {
      // --- PASSO 1: Registrar o Usuário ---
      // (usando userRegistrationData)
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
        console.error("Erro no cadastro (backend):", errorData);
        let errorMessage = "Não foi possível criar a conta. ";
        if (errorData.username) {
          errorMessage += `Email: ${errorData.username[0]}`;
        } else if (errorData.email) {
          errorMessage += `Email: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMessage += `Senha: ${errorData.password[0]}`;
        } else {
          errorMessage += "Verifique os dados e tente novamente.";
        }
        throw new Error(errorMessage);
      }

      createdUser = await responseUser.json();
      console.log("Cadastro de usuário bem-sucedido:", createdUser);

      // --- PASSO 2: Fazer Login para obter o Token ---
      // Usamos o email/senha do formulário de registro
      localAccessToken = await signIn(
        userRegistrationData.email,
        userRegistrationData.password
      );

      if (!localAccessToken) {
        // Isso não deve acontecer se o registro deu certo, mas é bom verificar
        throw new Error("Cadastro realizado, mas o login automático falhou.");
      }

      console.log("Login automático bem-sucedido.");

      // --- PASSO 3: Criar a Meta ---
      // (usando userGoalData e o token)
      // !! AJUSTE ESTE ENDPOINT para sua URL de metas !!
      const responseGoal = await fetch(`${API_BASE_URL}api/goals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Usar o token de acesso obtido no login
          Authorization: `Bearer ${localAccessToken}`,
        },
        body: JSON.stringify(userGoalData),
      });

      console.log("Goal Response Status:", responseGoal.status);

      if (!responseGoal.ok) {
        // Se a meta falhar, o usuário já está criado e logado.
        // Apenas registramos o erro e continuamos.
        const errorGoalData = await responseGoal.json();
        console.warn(
          "Usuário criado e logado, mas falha ao criar meta:",
          errorGoalData
        );
        Alert.alert(
          "Aviso",
          "Sua conta foi criada, mas não foi possível salvar sua meta inicial. Você pode defini-la novamente no seu perfil."
        );
      } else {
        const goalData = await responseGoal.json();
        console.log("Meta criada com sucesso:", goalData);
      }

      // Se tudo (usuário + login) deu certo, retorna true
      return true;
    } catch (e) {
      console.error("Erro no processo de signUp:", e.message);
      // Se o erro foi ANTES do login (Passo 1), o usuário não está logado
      // Se o erro foi no login (Passo 2), o usuário não está logado
      if (!localAccessToken) {
        Alert.alert(
          "Erro no Cadastro",
          e.message || "Não foi possível criar a conta."
        );
      }
      return false; // Falha em alguma etapa crítica
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
        signUp, // <-- Função atualizada
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