import styles from "./Feed.module.css"
import { useState, useEffect } from "react"

const Feed = () => {

    const [posts, setPosts] = useState([])
    
    const fetchFeed = async () => {
        const response = await fetch("http://0.0.0.0:3000/feed")
        const data = await response.json()
        setPosts(data)
    }

    useEffect(() => {
        fetchFeed()
    }, [])

    return(
        <>
            <div className={styles.feedContainer}>
                {posts.map((post) => (
                    <div className={styles.card} key={post.id}>
                        <div className={styles.mediaWrapper}>
                            {post.file_type === "image" ? (
                                <img
                                    src={post.url}
                                    alt={post.caption}
                                    loading="lazy"
                                    className={styles.media}
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
                            <div className={styles.userBox}>
                                <span className={styles.username}>{post.username}</span>
                                <span className={styles.caption}>{post.caption}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Feed