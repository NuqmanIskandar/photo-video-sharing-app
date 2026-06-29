import { useState, useRef } from "react"
import styles from "./Upload.module.css"

const Upload = ({ toggleUpload, onUploadSuccess }) => {

    const fileInputRef = useRef(null)
    const [userFile, setUserFile] = useState(null)
    const [userCaption, setUserCaption] = useState("")
    const [errorMessage, setErrorMessage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setUserFile(file)
        }
    }

    const handleUpload = async () => {
        setIsLoading(true)
        if (!userFile || !userCaption) {
            console.error("File and caption are required")
            setErrorMessage(true)
            return
        }
        try {
            const formData = new FormData()
            formData.append("file", userFile)
            formData.append("caption", userCaption)
            const token = localStorage.getItem("token")

            const res = await fetch("http://localhost:3000/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                throw new Error(`Upload failed: ${res.status}`)
            }
            const data = await res.json()
            console.log(data)

            // reset form
            await onUploadSuccess()
            await toggleUpload()
            await setUserFile(null)
            await setUserCaption("")
            await setIsLoading(false)

        } catch (err) {
            setIsLoading(false)
            console.error("Error:", err)
        }
    }

    return (
        <>
            <div className={styles.uploadTab}>
                <div className={styles.overlay} onClick={toggleUpload}></div>
                <div className={styles.content}>
                    <h2>Add to your stash</h2>
                    
                    {/* Hidden native input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.hiddenInput}
                        onChange={handleFileChange}
                    />

                    {/* Custom trigger */}
                    <button
                        type="button"
                        className={styles.customFileButton}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {userFile ? userFile.name : "Choose a photo or video"}
                    </button>

                    <input
                        className={styles.captionInput}
                        placeholder="Caption..."
                        value={userCaption}
                        onChange={(e) => setUserCaption(e.target.value)}
                    />
                    {errorMessage && (
                        <p className={styles.errorMessage}>File and caption are required</p>
                    )}

                    <button onClick={handleUpload} className={isLoading? styles.uploadButtonLoading : styles.uploadButton} disabled={isLoading}>
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                            <span className={styles.spinner} /> Uploading...
                            </span>
                        ) : (
                            'Upload'
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Upload