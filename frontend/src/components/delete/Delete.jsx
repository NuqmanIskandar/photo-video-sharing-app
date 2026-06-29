import styles from './Delete.module.css'
import { API_BASE_URL } from "../../config"
import { useState } from 'react'

const Delete = ({ toggleDelete, postDelete, onDeleteSuccess }) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleDeletePost = async () => {
        setIsLoading(true)
        try  { 
            const token = localStorage.getItem("token")
            const res = await fetch(`${API_BASE_URL}/posts/${postDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Failed to delete post")
            }
            await onDeleteSuccess()
            await toggleDelete()
            awaitsetIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.error("Error:", err)
        }
    }

    return (
        <>
            <div className={styles.deleteTab}>
                <div className={styles.overlay} onClick={toggleDelete}></div>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <p>Remove this from your stash?</p>
                        <p>This can't be undone.</p>
                    </div>
                    <div className={styles.buttonWrapper}>
                        <button onClick={toggleDelete} className={styles.cancel}>Cancel</button>
                        <button onClick={handleDeletePost} className={isLoading ? styles.yesLoading : styles.yesNoLoading} disabled={isLoading}>
                            {isLoading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                                <span className={styles.spinner} /> Deleting...
                                </span>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Delete