import styles from "./Login.module.css"
import logo1 from "../../assets/logo1.svg"
import { useAuth } from "../AuthContext/AuthContext";
import { useState } from "react"

const Login = ({ toggleLogin, toggleSignup, user, setUser }) => {

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

            const res = await fetch("http://localhost:3000/login", {
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
            fetchUser()
        } catch(err) {
            console.error("Login error:", err)
            setErrorMessage(true)
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
            <div className={styles.loginTab}>
                <div className={styles.overlay} onClick={toggleLogin}></div>
                <div className={styles.content}>
                    <div className={styles.loginContainer}>
                        <button onClick={toggleLogin} className={styles.closeButton}>x</button>
                        <img src={logo1}/>
                        <h2>Welcome Back</h2>
                        <p>Log in to continue</p>
                        <div className={styles.fieldWrapper}>
                            <div className={styles.field}>
                                <span>Username</span>
                                <input
                                    className={styles.username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span>Password</span>
                                <input
                                type="password"
                                className={styles.password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                                {errorMessage && (
                                    <span className={styles.errorMessage}>Invalid username or password</span>
                                )}
                            </div>
                            <button onClick={handleLogin}>Log in</button>
                            <span>No account? <a onClick={toggleSignup}>Register</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login