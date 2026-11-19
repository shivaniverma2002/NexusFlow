
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import API_URL from "../config/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(
        () => sessionStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    // Verify existing token when the application loads
    useEffect(() => {
        const verifySession = async () => {
            const savedToken = sessionStorage.getItem("token");

            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${savedToken}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    sessionStorage.removeItem("token");
                    setToken(null);
                    setCurrentUser(null);
                    return;
                }

                setCurrentUser(data.user);

            } catch (error) {
                console.error("SESSION VERIFICATION ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    // Login and registration
    const authenticate = async (endpoint, credentials) => {
        const response = await fetch(
            `${API_URL}/api/users/${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            }
        );

       const data = await response.json();

if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
}

if (!data.token || !data.user) {
    throw new Error("Invalid authentication response from server");
}

        sessionStorage.setItem("token", data.token);

        setToken(data.token);
        setCurrentUser(data.user);

        return data;
    };

    const login = async (email, password) => {
        return authenticate("login", { email, password });
    };

    const register = async (name, email, password) => {
        return authenticate("register", {
            name,
            email,
            password
        });
    };

    // Logout
    const logout = () => {
        sessionStorage.removeItem("token");
        setToken(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                token,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
