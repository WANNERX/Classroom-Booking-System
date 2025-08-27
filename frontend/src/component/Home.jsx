import { Card } from "flowbite-react";
import { useEffect, useState } from "react";

function Home() {
  const userName = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const [buildingList, setBuildingList] = useState([]);

  const fetchBuilding = async () => {
    const response = await fetch("http://localhost:3000/building", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    setBuildingList(res.data);
  };

  useEffect(() => {
    fetchBuilding();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-2">
        {buildingList?.map((item) => (
          <Card
            key={item.building_code}
            className="max-w-sm bg-yellow-200"
            imgAlt="Building image"
            imgSrc={item.building_path_img}
          >
            <h5 className="text-2xl pb-3 font-bold tracking-tight text-gray-900">
              {item.building_code}
            </h5>
            <div className="h-full flex flex-col justify-between">
              <div>
                <p className="min-h font-normal text-gray-700">
                  {item.building_name}
                </p>
              </div>
              <div className="mt-4">
                {userName && (
                  <div className="space-x-1">
                    {(role === "admin" || role === "teacher") && (
                      <a
                        href={`booking?building=${item.building_code}`}
                        className="py-2 px-3 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        จอง
                      </a>
                    )}
                    <a
                      href={`reservationSchedule?filter=${item.building_code}`}
                      className="py-2 px-3 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      ดูตาราง
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;
