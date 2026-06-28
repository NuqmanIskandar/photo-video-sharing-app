import styles from "./Tab.module.css"
import { useAuth } from "../AuthContext/AuthContext";

const Tab = ({ feedFlag, setFeedFlag, toggleUpload }) => {

    const { isAuth } = useAuth()

    return (
        <>
            <div className={styles.tabContainer}>
                <button
                    onClick={() => setFeedFlag(true)}
                    className={feedFlag ? styles.active : ''}
                >
                    Feed
                </button>
                {isAuth && (
                    <>
                        <button
                            onClick={() => setFeedFlag(false)}
                            className={feedFlag ? '' : styles.active}
                        >
                            My Posts
                        </button>
                        <button onClick={toggleUpload} className={styles.addButton}>
                            + 
                        </button>
                    </>
                )}
                
            </div>
        </>
    )
}

export default Tab