import { useState } from "react";

function LoginhtmlForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null);

    const submit = async (event) => {
      event.preventDefault();
      
      if (!email || !password) {
        console.error("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
        return;
      }
    
      const requestData = { email, password };
    
      try {
        const response = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
    
        const data = await response.json();
    
        if (data.status === "success") {
          setAlert({ type: "success", message: data.message });
          setTimeout(() => window.location.href = "/", 1000);
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);
          localStorage.setItem("fullname", data.fullname);
          localStorage.setItem("uid", data.uid);
        } else {
          setAlert({ type: "error", message: data.error });
        }
      } catch (error) {
        setAlert({ type: "error", message: "Error: " + error.message });
      }
    };
  
    const alertStyles = {
      success: "bg-green-50 text-green-800 border-green-300",
      error: "bg-red-50 text-red-800 border-red-300",
    };
    
  return (
    <div className="h-screen">
      <form className="max-w-sm mx-auto mt-5 shadow rounded-lg p-6" onSubmit={submit}>
        <h1 className="text-xl mb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Login
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <p href="" className="m-4 ms-2 text-sm font-medium text-gray-900">
            หากคุณไม่มีบัญชี{" "}
            <a href="register" className="text-blue-600">
              สร้างบัญชี
            </a>
          </p>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
        {alert && (
            <div
              className={`flex items-center justify-center p-4 max-w-lg mt-4 text-sm ${alertStyles[alert.type]} border rounded-lg`}
              role="alert"
            >
              <svg
                className="shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
                />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">{alert.type === "success" ? "Success!" : "Error!"}</span>{" "}
                {alert.message}
              </div>
            </div>
          )}
      </form>
      
    </div>
  );
}

export default LoginhtmlForm;
