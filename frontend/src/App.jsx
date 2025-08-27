import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Booking from "./component/Booking";
import Footer from "./component/Footer";
import Developer from "./component/Developer";
import Loginform from "./component/Loginform";
import Registerform from "./component/RegisterForm";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/dev" element={<Developer />} />
            <Route path="/login" element={<Loginform />} />
            <Route path="/register" element={<Registerform />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}
export default App;
