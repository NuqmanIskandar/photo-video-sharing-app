import styles from "./Tab.module.css"

const Tab = ({ feedFlag, setFeedFlag }) => {
    return (
        <>
            <div className={styles.tabContainer}>
                <button
                onClick={() => setFeedFlag(true)}
                className={feedFlag ? styles.active : ''}
                >
                    Feed
                </button>
                <button
                onClick={() => setFeedFlag(false)}
                className={feedFlag ? '' : styles.active}
                >
                    My Posts
                </button>
            </div>
        </>
    )
}

export default Tab