import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api-config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

function RoomForm({ mode }) {
    const token = localStorage.getItem("token");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("room_id");
    const [roomCode, setRoomCode] = useState("");
    const [buildingCode, setBuildingCode] = useState("");
    const [buildingList, setBuildingList] = useState([]);
    
    useEffect(() => {
        const fetchBuildingList = async () => {
            try {
                const response = await fetch(API.getBuildingList);
                const data = await response.json();
                if (data.status === "success") {
                    setBuildingList(data.data);
                }
            } catch (error) {
                console.error("Failed to load building list:", error);
            }
        };

        fetchBuildingList();
    }, []);

    useEffect(() => {
        if (mode === "edit" && roomId) {
            const fetchRoomDetails = async () => {
                try {
                    const response = await fetch(`${API.getRoomById}/${roomId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (data.status === "success") {
                        const room = data.data;
                        setRoomCode(room.room_code || "");
                        setBuildingCode(room.building_code || "");
                    } else {
                        errorAlert(data.error || "ไม่พบข้อมูลห้อง");
                    }
                } catch (error) {
                    errorAlert("เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง: " + error.message);
                }
            };

            fetchRoomDetails();
        }
    }, [mode, roomId, token]);


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


    const submit = async (event) => {
        event.preventDefault();

        const requestData = { roomCode, buildingCode };

        try {
            const response = await fetch(mode === "add" ? `${API.addRoom}` : `${API.editRoom}/${roomId}`, {
                method: mode === "add" ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (data.status === "success") {
                successAlert(data.message);
                setTimeout(() => (window.location.href = "/rooms"), 1000);
            } else {
                errorAlert(data.error || "เกิดข้อผิดพลาดบางอย่าง");
            }
        } catch (error) {
            errorAlert(error.message);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 py-8">
            <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4">
                    <h1 className="text-xl font-bold text-gray-900">
                        {mode === "add" ? "เพิ่มห้องใหม่" : "แก้ไขข้อมูลห้อง"}
                    </h1>
                    <form className="space-y-4" onSubmit={submit}>
                        <div>
                            <label
                                htmlFor="RoomCode"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                รหัสห้อง
                            </label>
                            <input
                                type="text"
                                id="RoomCode"
                                className="border border-gray-300 rounded-lg w-full p-2.5"
                                placeholder="รหัสห้อง เช่น LP1401"
                                required
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="buildingCode"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                รหัสตึก
                            </label>
                            <select
                                id="buildingCode"
                                className="border border-gray-300 rounded-lg w-full p-2.5"
                                value={buildingCode}
                                onChange={(e) => setBuildingCode(e.target.value)}
                            >
                                <option value="">-- กรุณาเลือกตึก --</option>
                                {buildingList.map((building) => (
                                    <option key={building.building_code} value={building.building_code}>
                                        {building.building_name} ({building.building_code})
                                    </option>
                                ))}

                            </select>
                        </div>
                        <button
                            disabled={roomCode === "" || buildingCode === ""}
                            type="submit"
                            className="w-full bg-blue-700 text-white rounded-lg p-2.5 hover:bg-blue-800"
                        >
                            {mode === "add" ? "➕ เพิ่มห้อง" : "💾 บันทึก"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

RoomForm.propTypes = {
    mode: PropTypes.string.isRequired,
};

export default RoomForm;
