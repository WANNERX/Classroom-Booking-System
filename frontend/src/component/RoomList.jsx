import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import API from "../../api-config";
import Swal from "sweetalert2";

function RoomList() {
  const userRole = localStorage.getItem("role") || "";
  const token = localStorage.getItem("token") || "";
  const [searchText, setSearchText] = useState("");
  // const [roomList, setRoomList] = useState([]);
  // const [buildingList, setBuildingList] = useState([]);
  const [roomsManagementList, setRoomsManagementList] = useState([]);

const fetchData = async () => {
  try {
    const [roomRes, buildingRes] = await Promise.all([
      fetch(API.getRoomList),
      fetch(API.getBuildingList),
    ]);

    const roomData = await roomRes.json();
    const buildingData = await buildingRes.json();

    // merge ทันทีโดยไม่ต้องรอ useEffect
    const mergedData = roomData.data.map((room) => {
      const building = buildingData.data.find(
        (b) => b.building_code === room.building_code
      );
      return {
        ...room,
        building_code: building ? building.building_code : "ไม่พบรหัสตึก",
        building_name: building ? building.building_name : "ไม่พบชื่อตึก",
      };
    });

    setRoomsManagementList(mergedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

useEffect(() => {
  fetchData();
}, []);


  const handleConfirmDelete = async (Id, name) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: `คุณต้องการลบห้องนี้! (${name})`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ เรียก API ลบการจอง
          const response = await fetch(`${API.deleteRoom}/${Id}`, {
            method: "DELETE", // ใช้ DELETE แทน POST
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          });

          const data = await response.json();

          if (data.status === "success") {
            Swal.fire("ลบสำเร็จ!", data.message, "success");
            setTimeout(() => {
              fetchData();
            }, 1500);
          } else {
            Swal.fire("ลบผิดพลาด!", data.error || "เกิดข้อผิดพลาดบางอย่าง", "error");
          }
        } catch (error) {
          Swal.fire("ลบผิดพลาด!", error.message, "error");
        }
      }
    });
  };


  const handleEditRoom = async (Id) => {
    window.location.href = `/edit-room?room_id=${Id}`;
  }

  // Filtered data
  const filteredData = Array.isArray(roomsManagementList)
    ? roomsManagementList.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
    : [];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.room_id,
      sortable: true,
    },
    {
      name: "รหัสห้อง",
      selector: (row) => {
        return row.room_code;
      },
      sortable: true,
    },
    {
      name: "รหัสตึก",
      selector: (row) => row.building_code,
      sortable: true,
    },
    {
      name: "ชื่อตึก",
      selector: (row) => row.building_name,
      sortable: true,
    },
    ...(userRole === "admin"
      ? [
        {
          name: "จัดการ",
          width: "200px",
          cell: (row) => (
            <div className="flex space-x-2">
              {userRole === "admin" && (
                <>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      handleEditRoom(row.room_id)
                    }
                    }
                  >
                    แก้ไข
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      handleConfirmDelete(row.room_id, row.room_code);
                    }}
                  >
                    ลบ
                  </button>
                </>
              )}
            </div>
          ),
        },
      ]
      : [])
  ];

  return (
    <div className="p-4 h-full">
      <div className="w-full bg-white p-3 rounded-lg shadow sm:max-w-3xl xl:p-0">
        <h2 className="text-2xl text-center px-6 py-4 font-bold text-gray-900">
          รายการห้องทั้งหมด
        </h2>

        {/* 🔍 ช่องค้นหา */}
        <div className="mb-4">
          <div className="flex justify-end mb-2">
              <a
                href="/add-room"
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                ➕เพิ่มห้อง
              </a>
          </div>
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="ไม่พบข้อมูล"
        />
      </div>
    </div>
  );
}

export default RoomList;
