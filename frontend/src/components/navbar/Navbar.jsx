import styles from "./Navbar.module.css"
import logo from "../../assets/logo.svg"
import FetchUser from "../FetchUser"
import { useAuth } from "../AuthContext/AuthContext"
import { useEffect } from "react"

const Navbar = ({ toggleLogin, toggleSignup, user, setUser, setFeedFlag }) => {

    const { isAuth, logout } = useAuth()

    const handleLogout = () => {
        logout()
        setUser("")
        setFeedFlag(true)
    }

    useEffect(() => {
        if (isAuth) {
            setUser("")
            FetchUser({ setUser })
        } else {
            setUser("")
        }
    }, [isAuth])

    return (
        <>
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <img src={logo}/>
                    <p>Stash</p>
                </div>
                {isAuth ? (
                    <div className={styles.rightContainer}>
                        <span className={styles.userFullname}>{user.username}</span>
                        <button onClick={handleLogout} className={styles.logout}>Log out</button>
                    </div>
                ): (
                    <div className={styles.rightContainer}>
                        <button className={styles.login} onClick={toggleLogin}>Log in</button>
                        <button className={styles.signup} onClick={toggleSignup}>Sign up</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Navbar