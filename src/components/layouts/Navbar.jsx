import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";



function Navbar() {
  return (
    <div className="navbar montserrat bg-[#1c1f24] flex justify-between items-center px-8 py-4">
      <div className="flex gap-x-2 items-center">
        <GiHamburgerMenu className="cursor-pointer" color="white" size={22}/>
        <h1 className="text-[#A59775] font-medium text-lg">Security Push</h1>
      </div>
      <h1 className="text-[#A59775] text-lg font-medium">GSS Central Security Services Master <span className="text-xs">dev ・ sse-dev-03_00_00</span></h1>
      <div className="cursor-pointer"><MdAccountCircle color="white" size={26}/></div>
    </div>
  );
}

export default Navbar;
