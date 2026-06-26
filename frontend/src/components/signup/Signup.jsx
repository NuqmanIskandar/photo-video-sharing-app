import styles from "./Signup.module.css"
import { useAuth } from "../AuthContext/AuthContext";
import { useState } from "react"

const Signup = ({ toggleSignup, setUser }) => {

    const [username, setUsername] = useState("")
    const [fullName, setFullName] = useState("")
    const [password, setPassword] = useState("")

    const { login } = useAuth()

    const handleSignup = async () => {
        try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, fullName, password })
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.detail || "Signup failed");
            }

            // Signup succeeded — now log them in
            const params = new URLSearchParams()
            params.append("username", username)
            params.append("password", password)

            const loginRes = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
            })

            if (!loginRes.ok) throw new Error("Auto-login failed")

            const loginData = await loginRes.json()
            login(loginData.access_token)
            toggleSignup()
            fetchUser()
        } catch (err) {
            console.error("Signup error:", err)
        }
    }

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("http://localhost:3000/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.detail || "Failed to fetch user")
            }

            const data = await res.json()
            setUser(data)
        } catch (err) {
            console.error("Fetch user error:", err)
        }
    }

    return(
        <>
            <div className={styles.signupTab}>
                <div className={styles.overlay} onClick={toggleSignup}></div>
                <div className={styles.content}>
                    <div className={styles.signupContainer}>
                        <button onClick={toggleSignup} className={styles.closeButton}>X</button>
                        <h2>Sign Up</h2>
                        <p>Sign up to continue</p>
                        <div className={styles.fieldWrapper}>
                            <div className={styles.field}>
                                <span>Username</span>
                                <input
                                    className={styles.username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span>Full Name</span>
                                <input
                                    className={styles.fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <span>Password</span>
                                <input
                                    type="password"
                                    className={styles.password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className={styles.signupButton} onClick={handleSignup}>Sign up</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup