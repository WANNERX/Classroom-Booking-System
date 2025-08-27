import { Dropdown } from "flowbite-react";
import { HiLogin, HiLogout, HiUserAdd, HiRefresh } from "react-icons/hi";
import Swal from "sweetalert2";
import API from "../../api-config";

function Navbar() {
  const userName = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const fullname = localStorage.getItem("fullname");
  const logout = async () => {
    try {
      const response = await fetch(API.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.clear();
        setTimeout(() => (window.location.href = "/login"), 1000);
        localStorage.clear()
      } else {
        console.log(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetPasswordModalOpen = () => {
    Swal.fire({
      title: "รีเซ็ตรหัสผ่าน",
      html: `
        <input type="password" id="newPassword" class="swal2-input" placeholder="รหัสผ่านใหม่">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="ยืนยันรหัสผ่านใหม่">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "รีเซ็ต",
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
  
        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบ");
          return false;
        }
  
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("รหัสผ่านไม่ตรงกัน");
          return false;
        }
  
        return { newPassword };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { newPassword } = result.value;
  
        // TODO: ส่ง API รีเซ็ตรหัสผ่าน
        const response = await fetch(API.resetPassword, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ newPassword }),
        });
        const data = await response.json();
        if (data.status === "success") {
          Swal.fire("สำเร็จ!", data.message, "success");
        } else {
          Swal.fire("ผิดพลาด!", data.error, "error");
        }
      }
    });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-yellow-200 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-2">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/img/logo.png" className="h-14" alt="Logo" />
          <span className="truncate text-2xl font-semibold dark:text-white">
            Classroom Booking System
          </span>
        </a>
        <div className="flex md:order-2">
          <button
            type="button"
            data-collapse-toggle="navbar-search"
            aria-controls="navbar-search"
            aria-expanded="false"
            className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>

          <Dropdown label={(userName && fullname) ? fullname : (userName && !fullname) ? userName : "Login/Register"}>
            {userName && (
              <Dropdown.Header>
                <span className="block text-sm">{userName}</span>
              </Dropdown.Header>
            )}
            {!userName ? (
              <>
                <Dropdown.Item icon={HiLogin} href="login">
                  Login
                </Dropdown.Item>
                <Dropdown.Item icon={HiUserAdd} href="register">
                  Register
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item icon={HiRefresh} onClick={resetPasswordModalOpen}>
                  Reset Password
                </Dropdown.Item>
                <Dropdown.Item icon={HiLogout} onClick={logout}>
                  Sign out
                </Dropdown.Item>
              </>
            )}
          </Dropdown>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-search"
        >
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <ul className=" text-xl flex space-x-5 p-0 font-medium rounded-lg">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
              >
                หน้าหลัก
              </a>
            </li>
            {userName && userRole !== "student" && (
              <>
                <li>
                  <a
                    href="booking"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    จองห้องเรียน
                  </a>
                </li>
              </>
            )}

            <li>
              <a
                href="reservationSchedule"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                รายการจองห้องเรียน
              </a>
            </li>
            {userName && userRole === "admin" && (
              <>
              <li>
                <a
                  href="users"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  จัดการผู้ใช้
                </a>
              </li>
              <li>
                <a
                  href="rooms"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  จัดการห้องเรียน
                </a>
              </li>
              </>
            )}
            <li>
              <a
                href="dev"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                เกี่ยวกับ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
