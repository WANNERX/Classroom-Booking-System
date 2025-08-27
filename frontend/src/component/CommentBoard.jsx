import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
// import { format } from 'date-fns';
import Swal from 'sweetalert2'
import API from "../../api-config";
import dayjs from "dayjs";
import { FaTrash } from "react-icons/fa";
function CommentBoard() {
    const BASE_URL = "http://localhost:3000";
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get("booking_id") || "";
    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("uid"));
    const [building, setBuilding] = useState("");
    const [buildingList, setBuildingList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [responseBooking, setResponseBooking] = useState({});
    const [commentText, setCommentText] = useState("");
    const [commnetList, setCommentList] = useState([]);
    const [commentImage, setCommentImage] = useState(null);
    const fileInputRef = useRef(null);

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
            const response = await fetch(`${API.getBookingList}/${bookingId}`,
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
                setResponseBooking(res.data);
            } else {
                errorAlert(res.message || res.error || "ไม่สามารถดึงข้อมูลการจองได้");
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
            errorAlert("ไม่สามารถดึงข้อมูลการจองได้");
        }
    }

    useEffect(() => {
        fetchSearchBookingById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);

    const fetchBuilding = async () => {
        try {
            const response = await fetch(API.getBuildingList);

            const res = await response.json();
            setBuildingList(res.data);
        } catch (error) {
            console.error("Error fetching building:", error);
            errorAlert("ไม่สามารถดึงข้อมูลอาคารได้");
        }
    };

    const fetchUserList = async () => {
        try {
            const response = await fetch(API.getUserList);

            const res = await response.json();
            setUserList(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            errorAlert("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        }
    };

    const fetchCommentListByBookingId = async () => {
        try {
            const response = await fetch(`${API.getComment}/${bookingId}`,
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
                setCommentList(res.data);
            } else {
                errorAlert(res.message || res.error || "ไม่สามารถดึงข้อมูลการแสดงความคิดเห็นได้");
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
            errorAlert("ไม่สามารถดึงข้อมูลการแสดงความคิดเห็นได้");
        }
    }

    useEffect(() => {
        fetchBuilding();
        fetchUserList();
        fetchCommentListByBookingId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่า commentText หรือ commentImage มีค่า
        if (!commentText && !commentImage) {
            errorAlert("กรุณาใส่ข้อความหรือเลือกไฟล์รูปภาพก่อน");
            return;
        }

        // เตรียมข้อมูลที่จะส่งไปกับ FormData
        const formData = new FormData();
        formData.append("booking_id", Number(bookingId));
        if (commentText) {
            formData.append("comment", commentText);
        }
        if (commentImage) {
            formData.append("image", commentImage);
        }

        try {
            // ส่งคำขอเพื่อเพิ่มคอมเมนต์
            const response = await fetch(API.addComment, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const res = await response.json();

            if (res.status === "success") {
                successAlert(res.message);
                setCommentText("");
                setCommentImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                fetchCommentListByBookingId();
            }
            else {
                errorAlert(res.error || res.message || "ไม่สามารถแสดงความคิดเห็นได้");
            }
        } catch (error) {
            console.error("Error:", error);
            errorAlert("เกิดข้อผิดพลาดในการอัปโหลด");
        }
    };

    const nameBuilding = buildingList.find((i) => i.building_code === building)?.building_name || building;

    const findNameUser = (user_id) => {
        return userList.find((item) => item.user_id === user_id)?.fullname
    }

    const findRoleUser = (user_id) => {
        return userList.find((item) => item.user_id === user_id)?.role
    }

    const handleDeleteComment = (id, comment, imagePath) => {
        const imageHTML = imagePath
            ? `<div style="margin-top: 10px;"><img src="${BASE_URL}${imagePath}" style="max-width: 100%; border-radius: 8px;" /></div>`
            : "";

        Swal.fire({
            title: "คุณต้องการลบความคิดเห็นนี้?",
            html: `<p>${comment}</p>${imageHTML}`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API.deleteComment}/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token,
                        },
                    });

                    const data = await response.json();

                    if (data.status === "success") {
                        Swal.fire("ลบสำเร็จ!", data.message, "success");
                        setTimeout(() => {
                            fetchCommentListByBookingId();
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5MB max size
            errorAlert("ขนาดไฟล์รูปภาพเกินกำหนด (สูงสุด 5MB)");
        } else {
            setCommentImage(file);
        }
    };

    return (
        <div className="h-full">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
                <div className="w-1/2 bg-white rounded-lg shadow sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-center">แสดงความคิดเห็น, เสนอแนะ</h2>
                        <div className="mb-4 text-center">
                            {/* <p className="text-gray-600">หมายเลขการจอง: {bookingId}</p> */}
                            <p className="text-gray-600">{nameBuilding}</p>
                            <p className="text-gray-600">ห้อง: {responseBooking.room_code}</p>
                            <p className="text-gray-600">ผู้จอง: {responseBooking.booker_name}</p>
                            <p className="text-gray-600">จองเมื่อ: {dayjs(responseBooking.create_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p className="text-gray-600">วันเริ่มต้น: {dayjs(responseBooking.start_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p className="text-gray-600">วันสิ้นสุด: {dayjs(responseBooking.end_date).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <div className="flex items-center justify-center space-x-1 mt-3">
                                <p className="text-gray-600">สถานะ: </p>
                                <span
                                    className={`
                            px-3 py-1 rounded-full text-sm font-semibold 
                            ${responseBooking.status === "ยังไม่เริ่ม" ? "bg-yellow-200 text-yellow-800" : responseBooking.status === "เสร็จสิ้น" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"

                                        }`
                                    }
                                >
                                    {responseBooking.status}
                                </span>
                            </div>
                        </div>

                        {commnetList && commnetList.length > 0 && (
                            <div className="space-y-4 mb-6">
                                {commnetList.map((comment) => (
                                    <div
                                        key={comment.comment_id}
                                        className={`relative border-2 p-4 rounded-lg shadow-sm ${findRoleUser(comment.user_id) === "admin" ? "border-red-500" : "border-green-500"
                                            }`}
                                    >
                                        {/* Show delete button only if the comment's user_id matches the current userId */}
                                        {comment.user_id === userId && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.comment_id, comment.comment, comment.image_path)}
                                                className="absolute top-5 right-5 text-red-500 hover:text-red-800 text-xs cursor-pointer"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}

                                        {comment.image_path && (
                                            <div className="flex justify-center p-5">
                                                <img
                                                    src={`${BASE_URL}${comment.image_path}`}
                                                    alt="comment"
                                                    className="max-w-xs rounded"
                                                />
                                            </div>
                                        )}

                                        {/* Comment content */}
                                        <p className="text-gray-700">{comment.comment}</p>
                                        <p className="text-xs text-gray-400 mt-2">{findRoleUser(comment.user_id)}</p>
                                        <p className="text-xs text-gray-400">
                                            {findNameUser(comment.user_id)} {dayjs(comment.create_date).format("YYYY-MM-DD HH:mm")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}


                        {commnetList.length === 0 && (
                            <div className="text-center text-gray-400 mb-6">
                                ยังไม่มีความคิดเห็น
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block font-semibold mb-2">ข้อความ</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="กรุณาใส่ความคิดเห็นหรือข้อเสนอแนะของคุณที่นี่..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                ></textarea>

                            </div>
                            <div>
                                <label className="block font-semibold mb-2">รูป</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
     file:rounded-full file:border-0 file:text-sm file:font-semibold
     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 rounded-md"
                                />
                            </div>

                            <button
                                disabled={!commentText && !commentImage}
                                className={`w-full p-3 rounded-lg transition duration-200 ${!commentText && !commentImage
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                ส่ง
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentBoard;
