import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import "../../styles/Register.css"

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
        setLoading(false);
        alert("Đăng ký thành công!");
        navigate("/login");
    }, 1500);
  };

  return (
    <div className="bground_register">
      <form className="register_card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="input_user">
          <FontAwesomeIcon icon={faUser} size="lg" />
          <input
            type="text"
            className="username_register"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input_email">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
          <input
            type="email"
            className="email_register"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input_password">
          <FontAwesomeIcon icon={faLock} size="lg" />
          <input
            type="password"
            className="password_register"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button_register" disabled={loading}>
          {loading ? "Đang xử lý..." : "Register"}
        </button>
        <div className="login_link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}
