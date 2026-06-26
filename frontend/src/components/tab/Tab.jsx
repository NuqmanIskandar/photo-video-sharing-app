import styles from "./Tab.module.css"
import { useAuth } from "../AuthContext/AuthContext";
import { use } from "react";

const Tab = ({ feedFlag, setFeedFlag }) => {

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
                        <button>
                            +
                        </button>
                    </>
                )}
                
            </div>
        </>
    )
}

export default Tab