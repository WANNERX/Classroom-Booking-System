function Footer() {
  return (
    <footer className="z-50 w-full bg-gradient-to-r from-blue-500 to-yellow-200 text-gray-900 text-center px-4 py-2 sticky bottom-0">
      <p>
        &copy; {new Date().getFullYear()} Classroom Booking System. All Rights
        Reserved.
      </p>
    </footer>
  );
}

export default Footer;
