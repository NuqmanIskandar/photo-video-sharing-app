import styles from "./Navbar.module.css"
import logo from "../../assets/logo.svg"
import { useAuth } from "../AuthContext/AuthContext"

const Navbar = ({ toggleLogin, toggleSignup, user }) => {

    const { isAuth, logout } = useAuth()

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
                        <button onClick={logout} className={styles.logout}>Log out</button>
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