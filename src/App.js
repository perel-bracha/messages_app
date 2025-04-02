import logo from "./logo.svg";
import "./App.css";
import AddMessage from "./components/AddMessage";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { Screen } from "./components/Screen";
import { MessagesList } from "./components/MessagesList";
import { Home } from "./components/Home";
import { LogIn } from "./components/LogIn";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/add_message" element={<AddMessage />} />
        <Route path="/messages_list" element={<MessagesList />} />
      </Route>
      <Route path="/screen1" element={<Screen screenNum={1} />} />
      <Route path="/screen2" element={<Screen screenNum={2} />} />
      <Route path="/screen3" element={<Screen screenNum={3} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
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
