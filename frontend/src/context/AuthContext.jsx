
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

    // Verify existing JWT session when application loads
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

                if (!response.ok || !data.user) {
                    sessionStorage.removeItem("token");
                    setToken(null);
                    setCurrentUser(null);
                    return;
                }

                setCurrentUser(data.user);
                setToken(savedToken);

            } catch (error) {
                console.error("SESSION VERIFICATION ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    // Registration: Create account without logging in
    const register = async (name, email, password) => {
        const response = await fetch(
            `${API_URL}/api/users/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Registration failed"
            );
        }

        // Do not save JWT or authenticate after registration
        return data;
    };

    // Login: Authenticate and save JWT
    const login = async (email, password) => {
        const response = await fetch(
            `${API_URL}/api/users/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        if (!data.token || !data.user) {
            throw new Error(
                "Invalid authentication response from server"
            );
        }

        sessionStorage.setItem("token", data.token);

        setToken(data.token);
        setCurrentUser(data.user);

        return data;
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
