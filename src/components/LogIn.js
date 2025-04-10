import { useState } from "react";
import Swal from 'sweetalert2';

export function LogIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const login = async (e) => {
        e.preventDefault(); // מניעת רענון הדף
        // בדיקה אם השדות ריקים
        const errors = {};
        if (!formData.username) {
            errors.username = 'אנא מלא את שם המשתמש';
        }
        if (!formData.password) {
            errors.password = 'אנא מלא את הסיסמה';
        }
        if (Object.keys(errors).length > 0) {
            setFormData({ ...formData, errors });
            return;
        }
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
      
        if (data.success) {
          sessionStorage.setItem('token', data.token); // שמירת הטוקן
          Swal.fire({
            icon: 'success',
            title: '!התחברת בהצלחה',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = '/'; // הפניה לדף הבית
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'שגיאת התחברות',
            text: data.message
          });
        }
      };
      
    return (
        <div>
            <h1>כניסה למערכת</h1>
            <form onSubmit={login} className="login-form">
                <div>
                    <label>
                        שם משתמש:
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        סיסמה:
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            required 
                        />
                    </label>
                </div>
                <button type="submit">התחבר</button>
            </form>
        </div>
    );
}