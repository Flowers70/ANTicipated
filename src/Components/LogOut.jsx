import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogOut(){
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await logout();
            console.log("Logging out...");
            // After successful sign-out, navigate the user to the sign-in page
            navigate('/sign-in');
        } catch (error) {
            console.error("Failed to log out:", error);
            // Optional: Display an error message to the user
        }
    };
    
    // Only show the button if a user is logged in
    if (!logout) return null; 
    
    return (
        <button onClick={handleLogout}>
        Log Out
        </button>
    );
}