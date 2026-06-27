import styles from './Delete.module.css'

const Delete = ({ toggleDelete, postDelete, onDeleteSuccess }) => {

    const handleDeletePost = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`http://localhost:3000/posts/${postDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Failed to delete post")
            }
            onDeleteSuccess()
            toggleDelete(Delete)
        } catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <>
            <div className={styles.deleteTab}>
                <div className={styles.overlay} onClick={toggleDelete}></div>
                <div className={styles.content}>
                    <p>Are you sure you want to delete this item?</p>
                    <div className={styles.buttonWrapper}>
                        <button onClick={toggleDelete}>Cancel</button>
                        <button onClick={handleDeletePost}>Yes</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Delete