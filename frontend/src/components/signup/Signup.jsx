import styles from "./Signup.module.css"

const Signup = ({ toggleSignup }) => {
    return(
        <>
            <div className={styles.signupTab}>
                <div className={styles.overlay} onClick={toggleSignup}></div>
                <div className={styles.content}>
                    <h2>Hello</h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem mollitia quae deserunt eius fuga, nesciunt neque cupiditate in ipsam quia.</p>
                    <button onClick={toggleSignup}>CLOSE</button>
                </div>
            </div>
        </>
    )
}

export default Signup