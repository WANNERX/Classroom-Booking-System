import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import API from "../../api-config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";

function ReservationSchedule() {
  const userRole = localStorage.getItem("role") || "";
  const uid = Number(localStorage.getItem("uid"));
  const token = localStorage.getItem("token") || "";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "";

  const [searchText, setSearchText] = useState(initialFilter);
  const [reservations, setReservations] = useState([]);
  const [buildingList, setBuildingList] = useState([]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(API.getBookingList);
      const data = await response.json();
      setReservations(data.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchBuilding = async () => {
    try {
      const response = await fetch(API.getBuildingList);
      const data = await response.json();
      setBuildingList(data.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchBuilding();
  }, []);

  const handleConfirmDelete = async (bookingId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: `คุณต้องการลบการจองนี้! (ID: ${bookingId})`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ เรียก API ลบการจอง
          const response = await fetch(`${API.deleteBooking}/${bookingId}`, {
            method: "DELETE", // ใช้ DELETE แทน POST
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          });
  
          const data = await response.json();
  
          if (data.status === "success") {
            Swal.fire("ลบสำเร็จ!", data.message, "success");
            // คุณอาจจะต้อง refresh รายการหลังลบ เช่น เรียก fetchBookingList() อีกครั้ง
            setTimeout(() => {
              fetchReservations();
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
  

  const handleEditBooking = async (bookingId) => {
    // console.log("Edit booking", bookingId);
    window.location.href = `/edit-booking?booking_id=${bookingId}`;
  }

  const handleComment = async (bookingId) => {
    // console.log("Comment booking", bookingId);
    window.location.href = `/comment?booking_id=${bookingId}`;
  }

  // Filtered data
  const filteredData = Array.isArray(reservations)
    ? reservations.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    : [];

  const columns = [
    {
      name: "ลำดับ",
      selector: (row) => row.booking_id,
      sortable: true,
    },
    {
      name: "ตึก",
      selector: (row) => {
        const building = buildingList.find(b => b.building_code === row.building_code);
        return building ? building.building_name : row.building_code;
      },
      sortable: true,
      width: "400px",
      wrap: true,
    },    
    {
      name: "ห้อง",
      selector: (row) => row.room_code,
      sortable: true,
    },
    {
      name: "ผู้จอง",
      selector: (row) => row.booker_name,
      sortable: true,
    },
    {
      name: "วันที่จอง",
      wrap: true,
      width: "120px",
      selector: (row) => {
        dayjs.extend(utc);
        return dayjs(row.create_date).utc().local().format("YYYY/MM/DD HH:mm:ss");
      },
      sortable: true,
    },
    {
      name: "วันที่เวลาเริ่ม",
      wrap: true,
      width: "120px",
      selector: (row) => {
        dayjs.extend(utc);
        return dayjs(row.start_date).utc().format("YYYY/MM/DD HH:mm:ss");
      }
    },
    {
      name: "วันที่เวลาสิ้นสุด",
      wrap: true,
      width: "120px",
      selector: (row) => {
        dayjs.extend(utc);
        return dayjs(row.end_date).utc().format("YYYY/MM/DD HH:mm:ss");
      }
    },
    {
      name: "สถานะ",
      selector: (row) => {

        if (row.status === "ยังไม่เริ่ม") {
          return <span className="text-red-500 font-semibold">{row.status}</span>;
        }
        if (row.status === "สิ้นสุดแล้ว") {
          return <span className="text-green-600 font-semibold">{row.status}</span>;
        }
        return <span className="text-yellow-500 font-semibold">{row.status}</span>;
      },
    },
    ...(userRole !== "student"
      ? [
          {
            name: "จัดการ",
            width: "200px",
            cell: (row) => (
              <div className="flex space-x-2">
                {(userRole === "teacher" && row.user_id === uid) || userRole === "admin" ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                          handleComment(row.booking_id);
                        }
                      }
                    >
                      คอมเมนต์
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                          handleEditBooking(row.booking_id)
                        }
                      }
                    >
                      แก้ไข
                    </button>
                  </>
                ) : null}
                {(userRole === "teacher" && row.user_id === uid) || userRole === "admin" ? (
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      handleConfirmDelete(row.booking_id);
                    }}
                  >
                    ลบ
                  </button>
                ) : null}
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
          ตารางการจองห้อง
        </h2>

        {/* 🔍 ช่องค้นหา */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="ค้นหาห้อง / ผู้จอง / วันที่..."
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

export default ReservationSchedule;