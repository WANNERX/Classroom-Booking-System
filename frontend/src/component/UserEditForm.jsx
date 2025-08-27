import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api-config";
import Swal from "sweetalert2";

function UserEditForm() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("user_id");
  const [username, setUserName] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [role, setRole] = useState("");

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

    const fetchUserDetails = async () => {
        if (!userId) {
            return;
        }
        try {
          const response = await fetch(`${API.getUserById}/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          });
          const res = await response.json();
          if (res.status === "success") {
            setUserName(res.data.user_name);
            setFullname(res.data.fullname);
            setEmail(res.data.email);
            setTel(res.data.tel);
            setRole(res.data.role);
          } else {
            // setAlert({ type: "error", message: data.error });
            errorAlert(res.error);
          }
        } catch (error) {
        //   setAlert({ type: "error", message: "Error: " + error.message });
          errorAlert(error.message);
        }
    }

  useEffect(() => { 
    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const submit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      errorAlert("Passwords do not match");
      return;
    }
  
    // ประกอบ requestData แบบเงื่อนไข
    const requestData = { username, fullname, email, tel, role };
    
    if (password.trim() !== "") {
      requestData.password = password;
    }
  
    try {
      const response = await fetch(`${API.editUser}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (data.status === "success") {
        successAlert(data.message);
        setTimeout(() => (window.location.href = "/users"), 1000);
      } else {
        errorAlert(data.error);
      }
    } catch (error) {
      errorAlert(error.message);
    }
  };
  

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 py-8">
      <div className="w-1/2 py-6 bg-white rounded-lg shadow sm:max-w-md xl:p-0">
        <div className="p-6 m-8">
          <h1 className="text-xl font-bold text-gray-900">แก้ไขผู้ใช้</h1>
          <form className="space-y-4 px-6" onSubmit={submit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Usename
              </label>
              <input
                type="text"
                id="username"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                value={username}
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="fullname"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                ชื่อ
              </label>
              <input
                type="text"
                id="fullname"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                value={fullname}
                required
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="**********"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-xs text-blue-500">*ถ้าไม่ต้องการแก้ไขไม่ต้องกรอก</span>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                ยืนนยันรหัสผ่าน
              </label>
              <input
                type="password"
                id="confirm-password"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="**********"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="text-xs text-blue-500">*ถ้าไม่ต้องการแก้ไขไม่ต้องกรอก</span>
            </div>
            <div>
              <label
                htmlFor="tel"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                เบอร์ติดต่อ
              </label>
              <input
                type="tel"
                id="tel"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                value={tel}
                required
                minLength={10}
                maxLength={10}
                onChange={(e) => setTel(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                บทบาท
              </label>
                <select
                id="role"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                >
                    {/* <option value=""></option> */}
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                </select>
            </div>
            <button
              disabled={email == "" || password != confirmPassword}
              type="submit"
              className="w-full bg-blue-700 text-white rounded-lg p-2.5 hover:bg-blue-800"
            >
              บันทึก
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEditForm;
