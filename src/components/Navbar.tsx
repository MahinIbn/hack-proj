import Link from "next/link";
import React from "react";


type Props = {};

const Navbar = async (props: Props) => {
  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-center h-full gap-2 px-8 mx-auto sm:justify-between max-w-7xl">
        <Link href="/gallery" className="items-center hidden gap-2 sm:flex">
        <p className="rounded-lg border-black px-3 py-2 text-xl transition-all hover:-translate-y-[2px] md:block dark:border-white bg-gradient-to-r from-purple-800 to-blue-600 text-white">
        Falcon Tutor
        </p>
        </Link>
        <div className="flex gap-3 items-center">
            <Link href="/gallery" className="mr-3 border-2 text-blue-700  p-2 rounded-lg">
            Gallery
            </Link>
            <Link href="/create" className="mr-3 border-2 text-blue-700  p-2 rounded-lg">
                Explore a Topic
            </Link>
            {/* <Link href="/chat" className="mr-3 border-2 text-blue-700  p-2 rounded-lg">
                Chat with PDF
            </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;