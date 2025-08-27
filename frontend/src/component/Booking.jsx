import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from '@mui/material';
// import { format } from 'date-fns';
import Swal from 'sweetalert2'
import API from "../../api-config";
import dayjs from "dayjs";

function Booking(modeForUse) {
  // console.log("Booking mode:", modeForUse.mode);
  const mode = useState(modeForUse.mode)[0];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("booking_id") || "";
  const initialBuilding = queryParams.get("building") || "";
  const token = localStorage.getItem("token");
  const [building, setBuilding] = useState(initialBuilding);
  const [roomNumber, setRoomNumber] = useState("");
  const fullname = localStorage.getItem('fullname') || "";
  const uid = Number(localStorage.getItem('uid'));
  const [userName, setUserName] = useState(fullname || "");
  const [buildingList, setBuildingList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const now = dayjs().startOf('minute').add(5, "minute"); // เวลาปัจจุบันเพิ่ม 5 นาที
  const endOfDay = dayjs().endOf('day');

  const successAlert = (message) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const errorAlert = (message) => {
    Swal.fire({
      position: "center",
      showConfirmButton: true,
      icon: "error",
      title: "Oops!",
      text: message
    });
  };

  const fetchSearchBookingById = async () => {
    try {
      const response = await fetch(`${API.getBookingById}/${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const res = await response.json();
      if (res.status === "success") {
        setBuilding(res.data.building_code);
        setRoomNumber(res.data.room_code);
        setStartDateTime(dayjs(res.data.start_date).subtract(7, 'hour'));
        setEndDateTime(dayjs(res.data.end_date).subtract(7, 'hour'));
        setUserName(res.data.booker_name);
      } else {
        errorAlert(res.message || res.error || "ไม่สามารถดึงข้อมูลการจองได้");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      errorAlert("ไม่สามารถดึงข้อมูลการจองได้");
    }
  }

  useEffect(() => {
    if (mode === "edit") {
      fetchSearchBookingById();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = startDateTime ? dayjs(startDateTime) : now;
    const end = endDateTime ? dayjs(endDateTime) : endOfDay;

    const request = JSON.stringify({
      building_code: building,
      room_code: roomNumber,
      start_date: dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(end).format("YYYY-MM-DD HH:mm:ss"),
      booker_name: userName,
      user_id: uid
    });
    console.log(mode);
    
    if (mode === "create") {
      const response = await fetch(API.addBooking, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: request
      });
      const res = await response.json();
      if (res.status === "success") {
        successAlert(res.message)
        setTimeout(() => {
          window.location.href = "/reservationSchedule?filter=" + building;
        }, 1500);
      } else {
        errorAlert(res.error || res.message || "ไม่สามารถจองห้องเรียนได้");
      } 
    } else if (mode === "edit") {
      const response = await fetch(`${API.editBooking}/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: request
      });
      const res = await response.json();
      if (res.status === "success") {
        successAlert(res.message)
        setTimeout(() => {
          window.location.href = "/reservationSchedule?filter=" + building;
        }, 1500);
      } else {
        errorAlert(res.error || res.message || "ไม่สามารถแก้ไขการจองห้องเรียนได้");
      }
    } else {
      errorAlert("ไม่สามารถจองห้องเรียนได้");
    }
  };

  const fetchBuilding = async () => {
    try {
      const response = await fetch(API.getBuildingList);

      const res = await response.json();
      setBuildingList(res.data);
      // ถ้ายังไม่มีการเลือกอาคารจาก query param ให้เลือกอาคารแรกจาก list
      if (!initialBuilding && res.data.length > 0) {
        setBuilding(res.data[0].building_code);
      }
    } catch (error) {
      console.error("Error fetching building:", error);
      errorAlert("ไม่สามารถดึงข้อมูลอาคารได้");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(API.getRoomList);
      const res = await response.json();

      if (res.status === "success") {
        setRoomList(res.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      errorAlert("ไม่สามารถดึงข้อมูลห้องเรียนได้");
    }
  };

  useEffect(() => {
    fetchBuilding();
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // กรองห้องเฉพาะที่อยู่ในอาคารที่เลือก
  const filteredRooms = roomList.filter((room) => room.building_code === building);

  // ตั้งค่าห้องเริ่มต้นเมื่ออาคารเปลี่ยน
  useEffect(() => {
    if (filteredRooms.length > 0) {
      setRoomNumber(filteredRooms[0].room_code);
    } else {
      setRoomNumber(""); // ถ้าไม่มีห้องที่ตรงกับอาคาร ให้เคลียร์ค่า
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building, roomList]);

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center">Booking Classroom</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block font-semibold mb-2">เลือกอาคาร</label>
                <select
                  className="w-full p-2.5 border rounded-lg"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                >
                  {buildingList.map((item) => (
                    <option key={item.building_code} value={item.building_code}>
                      {item.building_code} : {item.building_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">เลือกห้อง</label>
                <select
                  className="w-full p-2.5 border rounded-lg"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  disabled={filteredRooms.length === 0} // ปิด select ถ้าไม่มีห้อง
                >
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                      <option key={room.room_id} value={room.room_code}>
                        {room.room_code}
                      </option>
                    ))
                  ) : (
                    <option>ไม่มีห้องในอาคารนี้</option>
                  )}
                </select>
              </div>

              <label className="block font-semibold mb-2">เลือกวันและเวลา</label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="flex gap-2">
                  {/* Start DateTime Picker */}
                  <div className="w-full">
                    {/* <p>เลือกวันและเวลาเริ่มต้น</p> */}
                    <DateTimePicker
                      className="w-full"
                      label="เริ่มต้น"
                      ampm={false}
                      format="yyyy-MM-dd HH:mm:ss"
                      value={startDateTime ? new Date(startDateTime) : new Date(now)}
                      onChange={(newValue) => {
                        const formatted = dayjs(newValue).format("YYYY-MM-DD HH:mm:ss");
                        setStartDateTime(formatted);

                        // ถ้า EndDate เดิมไม่ valid แล้ว ให้ reset
                        if (endDateTime && new Date(formatted) >= new Date(endDateTime)) {
                          setEndDateTime('');
                        }
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </div>

                  {/* End DateTime Picker */}
                  <div className="w-full">
                    {/* <p>เลือกวันและเวลาสิ้นสุด</p> */}
                    <DateTimePicker
                      className="w-full"
                      label="สิ้นสุด"
                      ampm={false}
                      format="yyyy-MM-dd HH:mm:ss"
                      value={endDateTime ? new Date(endDateTime) : new Date(endOfDay)}
                      onChange={(newValue) => {
                        if (startDateTime && newValue && newValue > new Date(startDateTime)) {
                          const formatted = dayjs(newValue).format("YYYY-MM-DD HH:mm:ss");
                          setEndDateTime(formatted);
                        } else {
                          alert("ช่วงเวลาสิ้นสุด ต้องมากกว่า ช่วงเวลาเริ่ม!");
                        }
                      }}
                      minDateTime={startDateTime ? new Date(startDateTime) : undefined}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </div>
                </div>
              </LocalizationProvider>
              <div>
                <label className="block font-semibold mb-2">ชื่อผู้จอง</label>
                <input
                  type="text"
                  className="w-full p-2.5 border rounded-lg"
                  placeholder="ชื่อผู้จอง"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                {mode === "create" ? "จองห้องเรียน" : "แก้ไขการจอง"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
