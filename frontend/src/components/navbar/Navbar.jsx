import styles from "./Navbar.module.css"
import FetchUser from "../FetchUser"
import { useAuth } from "../AuthContext/AuthContext"
import { useEffect } from "react"

const Navbar = ({ toggleLogin, toggleSignup, user, setUser, setFeedFlag, setIsLoginLoading, setIsSignupLoading }) => {

    const { isAuth, logout } = useAuth()

    const handleLogout = () => {
        logout()
        setUser("")
        setFeedFlag(true)
        setIsSignupLoading(false)
        setIsLoginLoading(false)
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
                    <svg width="160" height="44" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5 L15.8 14 L25 16 L15.8 18 L14 27 L12.2 18 L3 16 L12.2 14 Z" 
                                fill="#6B8F71" transform="translate(0,2)"/>
                        <text x="34" y="29" fontFamily="Georgia, 'Times New Roman', serif" 
                                fontWeight="700" fontSize="24" fill="#2E332B" letterSpacing="-0.5">
                            Stash
                        </text>
                     </svg>
                </div>
                {isAuth ? (
                    <div className={styles.rightContainer}>
                        <span className={styles.userFullname}>{user.username}</span>
                        <span className={styles.divider}></span>
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