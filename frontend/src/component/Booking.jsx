function Booking() {
  return (
    <div className="container mx-auto mt-5 px-4">
      <div className="flex justify-center">
        <div className="w-full h-screen max-w-md">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-yellow-200 text-gray-900 text-center py-4">
              <h3 className="text-lg font-semibold">Booking</h3>
            </div>
            <div className="p-6">
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="disabledTextInput"
                    className="block text-gray-700 font-medium"
                  >
                    Disabled input
                  </label>
                  <input
                    type="text"
                    id="disabledTextInput"
                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100"
                    placeholder="Disabled input"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="disabledSelect"
                    className="block text-gray-700 font-medium"
                  >
                    Disabled select menu
                  </label>
                  <select
                    id="disabledSelect"
                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100"
                  >
                    <option>Disabled select</option>
                    <option>Disabled select</option>
                    <option>Disabled select</option>
                    <option>Disabled select</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
