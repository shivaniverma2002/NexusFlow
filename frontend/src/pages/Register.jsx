import { useState } from "react";
import { registerUser } from "../services/authService.js";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
        // Step 1: Create Firebase account
        const userCredential = await registerUser(email, password);

        // Step 2: Generate Firebase ID token
        const token = await userCredential.user.getIdToken();

        // Step 3: Save profile in MongoDB
        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Profile creation failed");
        }

        console.log("Registration successful:", data);

    } catch (error) {
        console.error("Registration error:", error.code, error.message);

        setError(error.message);
    }
};

    return (
        <div>
            <h1>Create Your Account</h1>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

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
                    minLength={6}
                    required
                />

                <button type="submit">Register</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
};

export default Register;