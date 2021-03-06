import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  image: string;
  name: string;
  email: string;
  password: string;
}

interface UserContextData {
  user: {
    image: string;
    name: string;
    email: string;
    password: string;
  };
  changeImage: (image: string) => void;
  changeName: (name: string) => void;
  changeEmail: (email: string) => void;
  changePassword: (password: string) => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserState>({} as UserState);

  const changeImage = useCallback((image: string) => {
    setUser({
      ...user,
      image,
    } as UserState);
  }, []);

  const changeName = useCallback((name: string) => {
    setUser({
      ...user,
      name,
    } as UserState);
  }, []);

  const changeEmail = useCallback((email: string) => {
    setUser({
      ...user,
      email,
    } as UserState);
  }, []);

  const changePassword = useCallback((password: string) => {
    setUser({
      ...user,
      password,
    } as UserState);
  }, []);

  useEffect(() => {
    async function loadStorageUserName() {
      const name = await AsyncStorage.getItem("@rita:user");

      setUser({
        ...user,
        name,
      } as UserState);
    }

    loadStorageUserName();
  }, [user.name]);

  useEffect(() => {
    async function loadStorageImage() {
      const imageStorage = await AsyncStorage.getItem("@rita:image");

      // console.log(imageStorage);
      // console.log(user.image);
      // console.log(`É Diferente ${user.image !== imageStorage}`);

      if (imageStorage && imageStorage !== user.image) {
        setUser({
          ...user,
          image: imageStorage,
        });
      }
    }

    loadStorageImage();
  }, [user.image]);

  return (
    <UserContext.Provider value={{ user, changeImage, changeName, changeEmail, changePassword }}>
      {children}
    </UserContext.Provider>
  );
};

function useUser(): UserContextData {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a userProvider");
  }

  return context;
}

export { UserProvider, useUser };
