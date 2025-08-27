import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import API from "../../api-config";
import Swal from "sweetalert2";

function UserList() {
  const userRole = localStorage.getItem("role") || "";
  const token = localStorage.getItem("token") || "";
  const [searchText, setSearchText] = useState("");
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API.getUserList);
      const data = await response.json();
      setUserList(data.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConfirmDelete = async (Id, name) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: `คุณต้องการลบผู้ใช้นี้! (${name})`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ เรียก API ลบการจอง
          const response = await fetch(`${API.deleteUser}/${Id}`, {
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
              fetchUsers();
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
  

  const handleEditUser = async (Id) => {
    window.location.href = `/edit-user?user_id=${Id}`;
  }

  // Filtered data
  const filteredData = Array.isArray(userList)
    ? userList.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    : [];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: "username",
      selector: (row) => {
        return row.user_name;
      },
      sortable: true,
    },    
    {
      name: "ชื่อ",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "อีเมล",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "เบอร์ติดต่อ",
      wrap: true,
      selector: (row) => {
        return row.tel;
      },
    },
    {
      name: "บทบาท",
      selector: (row) => {
        if (row.role === "admin") {
          return <span className="px-2 rounded-md bg-red-500 text-white">Admin</span>;
        } else if (row.role === "teacher") {
          return <span className="px-2 rounded-md bg-green-500 text-white">Teacher</span>;
        }  else {
          return <span className="px-2 rounded-md bg-yellow-500 text-white">Student</span>;
        }
      },
    },
    ...(userRole !== "student"
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
                        handleEditUser(row.user_id)
                        }
                      }
                    >
                      แก้ไข
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        handleConfirmDelete(row.user_id, row.user_name);
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
    <div className="p-4 h-screen">
      <div className="w-full bg-white p-3 rounded-lg shadow sm:max-w-3xl xl:p-0">
        <h2 className="text-2xl text-center px-6 py-4 font-bold text-gray-900">
          รายการผู้ใช้ทั้งหมด
        </h2>

        {/* 🔍 ช่องค้นหา */}
        <div className="mb-4">
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

export default UserList;
