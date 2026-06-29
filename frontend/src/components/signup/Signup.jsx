import styles from "./Signup.module.css"
import { useAuth } from "../AuthContext/AuthContext"
import { useState } from "react"

const Signup = ({ toggleSignup }) => {

    const [username, setUsername] = useState("")
    const [full_name, setFullName] = useState("")
    const [password, setPassword] = useState("")

    const { login } = useAuth()

    const handleSignup = async () => {
        try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, full_name, password })
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
        } catch (err) {
            console.error("Signup error:", err)
        }
    }

    return(
        <>
            <div className={styles.signupTab}>
                <div className={styles.overlay} onClick={toggleSignup}></div>
                <div className={styles.content}>
                    <div className={styles.signupContainer}>
                        <div className={styles.header}>
                            <h2>Join the stash</h2>
                            <p>Start saving your finds</p>
                        </div>
                        <div className={styles.fieldWrapper}>
                            <input
                                className={styles.username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                            <input
                                className={styles.fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Fullname"
                            />
                            <input
                                type="password"
                                className={styles.password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                           <button className={styles.signupButton} onClick={handleSignup}>Sign up</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup