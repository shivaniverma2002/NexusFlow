import { useState } from "react";
import {
    loginUser,
    loginWithGoogle
} from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Authenticate user with Firebase
            const userCredential = await loginUser(email, password);

            console.log("Logged-in user:", userCredential.user);

            navigate("/dashboard");

        } catch (error) {
            setError(error.message);
        }
    };
    
    const handleGoogleLogin = async () => {
    setError("");

    try {
        const userCredential = await loginWithGoogle();
        const user = userCredential.user;

        const token = await user.getIdToken();

        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: user.displayName || "Google User"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Profile creation failed");
        }

        navigate("/dashboard");

    } catch (error) {
        setError(error.message);
    }
};
    return (
        <div>
            <h1>Welcome Back</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
                <button type="button" onClick={handleGoogleLogin}>
                    Continue with Google
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;