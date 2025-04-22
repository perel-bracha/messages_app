import "./App.css";
import AddMessage from "./components/AddMessage";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { Screen } from "./components/Screen";
import { MessagesList } from "./components/MessagesList";
import { Home } from "./components/Home";
import { LogIn } from "./components/LogIn";
import { Navigate } from "react-router-dom";
import { RotatingMessages } from "./components/ScreenClali";
import { io } from "socket.io-client";
const socket = io(`${process.env.REACT_APP_SERVER_URL}`);
function App() {
  const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token"); // Assuming token is stored in localStorage
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route index path="/home" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route
            path="/add_message"
            element={
              <ProtectedRoute>
                <AddMessage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages_list"
            element={
              <ProtectedRoute>
                <MessagesList />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/screen1"
          element={<Screen screenNum={1} socket={socket} />}
        />
        <Route
          path="/screen2"
          element={<Screen screenNum={2} socket={socket} />}
        />
        <Route path="/screen3" element={<RotatingMessages socket={socket} />} />
        <Route
          path="*"
          element={
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route index path="/home" element={<Home />} />
                <Route path="/login" element={<LogIn />} />
                <Route
                  path="/add_message"
                  element={
                    <ProtectedRoute>
                      <AddMessage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages_list"
                  element={
                    <ProtectedRoute>
                      <MessagesList />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/screen1"
                element={<Screen screenNum={1} socket={socket} />}
              />
              <Route
                path="/screen2"
                element={<Screen screenNum={2} socket={socket} />}
              />
              <Route
                path="/screen3"
                element={<RotatingMessages socket={socket} />}
              />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          }
        />
      </Routes>
    </>
  );
}
const Layout = () => {
  const style = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <NavLink to="/home" style={style}>
          דף הבית
        </NavLink>
        <NavLink to="/add_message" style={style}>
          הוספת הודעה
        </NavLink>
        <NavLink to="/messages_list" style={style}>
          רשימת הודעות
        </NavLink>
        <NavLink to="/screen1" style={style}>
          מסך מגמות 1
        </NavLink>
        <NavLink to="/screen2" style={style}>
          מסך מגמות 2
        </NavLink>
        <NavLink to="/screen3" style={style}>
          מסך הודעות כלליות
        </NavLink>
      </nav>
      {/* <NavLink
      className="login-link"
        to="/login"
        style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}
      >
        כניסה למערכת
      </NavLink> */}
      <main style={{ padding: "1rem 0" }}>
        <Outlet />
      </main>
    </>
  );
};
const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>404</h1>
      <p>הדף שחיפשת לא נמצא</p>
    </div>
  );
};
export default App;
