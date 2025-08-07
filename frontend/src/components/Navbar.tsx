'use client';

import { NavLink } from "react-router";


export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 justify-between fixed top-0 w-full z-50">
      <div className=" flex items-center"><div className="text-xl font-bold">BEEV</div>
      <div className="space-x-4 text-right w-full">
        <NavLink to="/" className="text-gray-600 hover:text-black">Home</NavLink>
        <NavLink to="/vehicles" className="text-gray-600 hover:text-black">Véhicules</NavLink>
      </div></div>
    </nav>
  );
}
