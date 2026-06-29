import { API_BASE_URL } from "../config"

const FetchUser = async ({ setUser }) => {
    try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.detail || "Failed to fetch user")
        }

        const data = await res.json()
        setUser(data)
    } catch (err) {
        console.error("Fetch user error:", err)
    }
}

export default FetchUser