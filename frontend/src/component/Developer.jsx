import { Card } from "flowbite-react";
import { FaFacebook, FaLine, FaSquareInstagram } from "react-icons/fa6";

function Developer() {
  return (
    <div className="mt-5 flex flex-col justify-center items-center">
      <div className="flex justify-center space-x-2 mb-5">
        <Card
          className="max-w-sm shadow-md"
          style={{
            background: "linear-gradient(to right, #FCE96A, #3F83F8)",
          }}
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc="img/phai.jpg"
        >
          <h1 className="text-2xl font-bold tracking-tight text-red-500 drop-shadow-lg text-center bg-white/50 rounded-md">
            Frontend
          </h1>
          <h5 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
            นาย วิทยา ศรีบัวลา
          </h5>
          <p className="font-normal text-gray-700">รหัสนักศึกษา 65424201012</p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/phaiwitaya?locale=th_TH">
              <FaFacebook className="text-blue-900 w-7 h-7" />
            </a>
            <a href="https://www.instagram.com/phai_magicz/">
              <FaSquareInstagram className="text-red-500 w-7 h-7" />
            </a>
            <a href="">
              <FaLine className="text-green-500 w-7 h-7" />
            </a>
          </div>
        </Card>
        <Card
          className="max-w-sm bg-gradient-to-r from-blue-500 to-yellow-200 shadow-md"
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc="img/biwty.jpg"
        >
          <h1 className="text-2xl font-bold tracking-tight text-red-500 drop-shadow-lg text-center bg-white/50 rounded-md">
            Backend
          </h1>
          <h5 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
            นางสาว พลอยไพลิน ทะสิละ
          </h5>
          <p className="font-normal text-gray-700">รหัสนักศึกษา 65424201002</p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/ploypaili.thasila.5?locale=th_TH">
              <FaFacebook className="text-blue-900 w-7 h-7" />
            </a>
            <a href="https://www.instagram.com/_.biwty/">
              <FaSquareInstagram className="text-red-500 w-7 h-7" />
            </a>
            <a href="">
              <FaLine className="text-green-500 w-7 h-7" />
            </a>
          </div>
        </Card>
        <a href="#1">
          <img src="img/arrow.gif" alt="" className="w-12 h-12" />
        </a>
      </div>
      <div className="mt-4 w-1/2" id="1">
        <p className="text-wrap p-5">
          <h className="font-bold">Project</h>{" "}
          นี้ทำเพื่อช่วยในการจัดแจงเวลาให้เป็นระบบ
          ระบบจองห้องเรียนจะเป็นเครื่องมือที่ช่วยยกระดับการจัดการทรัพยากรในสถานศึกษา
          ทำให้การบริหารจัดการมีความรวดเร็ว และสะดวกสบายยิ่งขึ้น
          ทั้งยังช่วยลดข้อผิดพลาด ซึ่งมีบทบาทสำคัญในการพัฒนาคุณภาพการเรียนการสอน
        </p>
      </div>
    </div>
  );
}

export default Developer;
