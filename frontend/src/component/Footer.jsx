function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-500 to-yellow-200 text-gray-900 text-center p-4 sticky bottom-0 left-0">
      <p>
        &copy; {new Date().getFullYear()} Classroom Booking System. All Rights
        Reserved.
      </p>
    </footer>
  );
}

export default Footer;
