import React from "react";
import { usePrivy } from "@privy-io/react-auth"; // Import for login/logout logic
import { CustomButton } from "../components"; // Import the CustomButton component

function Landing() {
  const { authenticated, login, logout } = usePrivy(); // Destructure login/logout functions

  const handleLoginLogout = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Understand User Flow.
            <strong className="font-extrabold text-red-700 sm:block">
              Increase Conversion.
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
            illo tenetur fuga ducimus numquam ea!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CustomButton
              btnType="button"
              title={authenticated ? "Log Out" : "Log In"} // Dynamic title
              styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"} // Dynamic styles
              handleClick={handleLoginLogout} // Login/logout functionality
            />
            <a
              className="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
