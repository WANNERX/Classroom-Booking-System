import { useState } from "react";

function RegisterForm() {
  const [username, setUserName] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [alert, setAlert] = useState(null);

  const submit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match" });
      return;
    }

    const requestData = { username, fullname, email, password, tel };

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.status === "success") {
        setAlert({ type: "success", message: data.message });
        setTimeout(() => (window.location.href = "/login"), 1000);
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
    <div className="h-full flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold text-gray-900">Register</h1>
          <form className="space-y-4" onSubmit={submit}>
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
                placeholder="Username"
                required
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="fullname"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Full name
              </label>
              <input
                type="text"
                id="fullname"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="Full name"
                required
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="Confirm password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="tel"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tel
              </label>
              <input
                type="tel"
                id="tel"
                className="border border-gray-300 rounded-lg w-full p-2.5"
                placeholder="Tel"
                required
                minLength={10}
                maxLength={10}
                onChange={(e) => setTel(e.target.value)}
              />
            </div>
            {alert && (
              <div
                className={`flex items-center p-4 mb-4 text-sm ${
                  alertStyles[alert.type]
                } border rounded-lg`}
                role="alert"
              >
                <svg
                  className="shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">
                    {alert.type === "success" ? "Success!" : "Error!"}
                  </span>{" "}
                  {alert.message}
                </div>
              </div>
            )}
            <button
              disabled={email == "" || password != confirmPassword}
              type="submit"
              className="w-full bg-blue-700 text-white rounded-lg p-2.5 hover:bg-blue-800"
            >
              สร้างบัญชี
            </button>
          </form>
          <p className="m-4 ms-2 text-sm font-medium text-gray-900">
            มีบัญชีอยู่แล้ว?{" "}
            <a href="login" className="font-medium text-blue-600">
              เข้าสู่ระบบที่นี่
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
