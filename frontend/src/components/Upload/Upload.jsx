import { useState } from "react"
import styles from "./Upload.module.css"

const Upload = ({ toggleUpload, onUploadSuccess }) => {

    const [userFile, setUserFile] = useState(null)
    const [userCaption, setUserCaption] = useState("")

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setUserFile(file)
        }
    }

    const handleUpload = async () => {
        if (!userFile || !userCaption) {
            console.error("File and caption are required")
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
            setUserFile(null)
            setUserCaption("")
            await onUploadSuccess()
            toggleUpload()

        } catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <>
            <div className={styles.uploadTab}>
                <div className={styles.overlay} onClick={toggleUpload}></div>
                <div className={styles.content}>
                    <h2>Upload image or video</h2>
                    <input
                        type="file"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                    />
                    <input
                        placeholder="Caption..."
                        onChange={(e) => setUserCaption(e.target.value)}
                    />
                    <button onClick={handleUpload}>Upload</button>
                    <button onClick={toggleUpload}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default Upload