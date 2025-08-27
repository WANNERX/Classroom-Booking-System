import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Marquee from "react-fast-marquee";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Booking from "./component/Booking";
import Footer from "./component/Footer";
import Developer from "./component/Developer";
import Loginform from "./component/Loginform";
import Registerform from "./component/RegisterForm";
import ReservationSchedule from "./component/Reservation_schedule";
import UserList from "./component/UserList";
import CommentBoard from "./component/CommentBoard";
import UserEditForm from "./component/UserEditForm";
import RoomList from "./component/RoomList";
import RoomForm from "./component/RoomForm";

function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <div>
          <Router>
            <Navbar />
            <Marquee speed={80}>
            This project is designed to facilitate classroom reservations. It was developed by Mr.Witaya Seboela and Ms.Ploypailin Thasila.
            </Marquee>  
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/booking" element={<Booking mode={"create"} />} />
                <Route path="/edit-booking" element={<Booking mode={"edit"} />} />
                <Route path="/dev" element={<Developer />} />
                <Route path="/login" element={<Loginform />} />
                <Route path="/register" element={<Registerform />} />
                <Route
                  path="/reservationSchedule"
                  element={<ReservationSchedule />}
                />
                <Route path="/users" element={<UserList />} />
                <Route path="/edit-user" element={<UserEditForm />} />
                <Route path="/comment" element={<CommentBoard />} />
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/add-room" element={<RoomForm mode={"add"} />} />
                <Route path="/edit-room" element={<RoomForm mode={"edit"} />} />
              </Routes>
            </div>
              <Footer />
          </Router>
        </div>
      </div>
      
  );
}
export default App;
