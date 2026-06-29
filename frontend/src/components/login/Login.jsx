import styles from "./Login.module.css"
import { API_BASE_URL } from "../../config"
import { useAuth } from "../AuthContext/AuthContext"
import { useState } from "react"

const Login = ({ toggleLogin, toggleSignup }) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(false)

    const { login } = useAuth()

    const handleLogin = async () => {
        try {
            const params = new URLSearchParams()
            params.append("grant_type", "password")
            params.append("username", username)
            params.append("password", password)

            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params,
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.detail || "Login failed");
            }

            const data = await res.json()
            login(data.access_token)
            toggleLogin()
        } catch(err) {
            console.error("Login error:", err)
            setErrorMessage(true)
        }
    }

    return(
        <>
            <div className={styles.loginTab}>
                <div className={styles.overlay} onClick={toggleLogin}></div>
                <div className={styles.content}>
                    <div className={styles.loginContainer}>
                        <div className={styles.header}>
                            <h2>Welcome Back</h2>
                            <p>Log in to see your stash</p>
                        </div>
                        
                        <div className={styles.fieldWrapper}>
                            <div className={styles.field}>
                                <input
                                    className={styles.username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                />
                                <input
                                    type="password"
                                    className={styles.password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                                {errorMessage && (
                                    <span className={styles.errorMessage}>Invalid username or password</span>
                                )}
                                <button onClick={handleLogin}>Log in</button>
                                <span className={styles.registerHere}>No account? <a onClick={toggleSignup}>Register</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login