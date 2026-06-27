import styles from './Myposts.module.css'
import QuestionMark from '../../assets/question_mark.svg'
import deleteButton from '../../assets/delete.svg'

const Myposts = ({ posts, toggleDelete, setPostDelete }) => {

    const handleDeleteButton = (post_id) => {
        toggleDelete()
        setPostDelete(post_id)
    }

    return (
        <>
            {(posts.length === 0) ? (
                <div className={styles.noPost}>
                    <img
                        src={QuestionMark}
                        draggable="false"
                    />
                    <p>You haven't post anything yet.</p>
                </div>
            ) : (
                <div className={styles.postContainer}>
                    {posts.map((post) => (
                        <div className={styles.card} key={post.id}>
                            <div className={styles.mediaWrapper}>
                                {post.file_type === "image" ? (
                                    <img
                                        src={post.url}
                                        alt={post.caption}
                                        loading="lazy"
                                        className={styles.media}
                                        draggable="false"
                                    />
                                ) : (
                                    <video
                                        src={post.url}
                                        poster={`${post.url}?tr=w-300,h-300`}
                                        controls
                                        preload="none"
                                        className={styles.media}
                                    />
                                )}
                                <button className={styles.delete} onClick={() => handleDeleteButton(post.id)}>
                                    <img
                                        src={deleteButton}
                                        className={styles.deleteIcon}
                                        draggable="false"
                                    />
                                </button>
                                <div className={styles.userBox}>
                                    <span className={styles.username}>{post.username}</span>
                                    <span className={styles.caption}>{post.caption}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default Myposts