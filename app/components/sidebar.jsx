"use client";

import React, { useState, useEffect } from "react";
import { FiChevronsRight, FiHome, FiUsers } from "react-icons/fi";
import { LuUserPlus, LuSquareUser, LuSettings } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if sidebar should be expanded
  const shouldExpand = isOpen || isHovered;

  return (
    <motion.nav
      layout
      className="fixed z-20 h-screen shrink-0 border-r border-slate-300 bg-white transition-width duration-400 ease-in-out"
      style={{
        width: shouldExpand ? "200px" : "50px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`flex py-4 ${
          shouldExpand ? "justify-start px-4" : "justify-center"
        }`}
      >
        <Image src="/logo-black.svg" alt="Logo" width={20} height={20} />
        {shouldExpand && (
          <span className={`text-xl font-semibold ml-2`}>Prescribed</span>
        )}
      </div>

      {/* horizontal line */}
      <div className={`mx-4 border-t border-slate-300 mb-2`}></div>

      {/* Menu Items */}
      <div
        className={`flex flex-col ${
          shouldExpand ? "items-start px-2" : "items-center"
        }`}
      >
        <Option
          Icon={FiHome}
          title="Dashboard"
          isOpen={shouldExpand}
          path="/doctor"
        />
        <Option
          Icon={FiUsers}
          title="Patients"
          isOpen={shouldExpand}
          path="/doctor/patients"
        />
        <Option
          Icon={LuUserPlus}
          title="New Registration"
          isOpen={shouldExpand}
          path="/doctor/new-registration"
        />
        <Option
          Icon={TfiWrite}
          title="Prescription"
          isOpen={shouldExpand}
          path="/doctor/prescribe"
        />
        <Option
          Icon={LuSquareUser}
          title="Profile"
          isOpen={shouldExpand}
          path="/doctor/profile"
        />
        <Option
          Icon={LuSettings}
          title="Settings"
          isOpen={shouldExpand}
          path="/doctor/settings"
        />
      </div>

      <ToggleClose isOpen={isOpen} setIsOpen={setIsOpen} />
    </motion.nav>
  );
};

export default Sidebar;

const Option = ({ Icon, title, selected, isOpen, path }) => {
  return (
    <Link
      href={path}
      className="relative flex cursor-pointer w-full items-center"
    >
      <motion.button
        layout
        className={`relative flex h-10 w-full ${
          isOpen ? "justify-start" : "justify-center"
        } items-center rounded-md transition-colors ${
          selected === title
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <motion.div
          layout
          className="grid h-full w-10 place-content-center text-lg"
        >
          <Icon className="text-black" />
        </motion.div>
        {isOpen && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-sm font-normal ml-1"
          >
            {title}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
};

const ToggleClose = ({ isOpen, setIsOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setIsOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${isOpen && "rotate-180"}`}
          />
        </motion.div>
        {isOpen && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-sm font-normal ml-2"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
