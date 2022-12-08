"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import useDetectClick from "../../hooks/useDetectClick";

const MainHeader = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useDetectClick({ ref: menuRef });
  const pathName = usePathname();

  return (
    <header className="flex flex-row flex-nowrap justify-between items-center sticky top-0 px-2 py-1 z-30 text-black dark:text-white bg-custom-bg-light dark:bg-custom-bg-dark">
      <div className="font-semibold">
        <Link href={`${pathName !== "/" ? "/dashboard" : ""}`}>Home</Link>
      </div>

      <div>
        <div ref={menuRef} className="relative">
          <button
            className="hover:bg-slate-300 px-1 rounded-lg"
            type="button"
            onClick={() => setVisible((old) => !old)}
          >
            <i className="fas fa-user-circle text-3xl" />
          </button>

          {visible ? (
            <div className="w-36 absolute right-0 mt-4 rounded-lg bg-slate-200 overflow-hidden">
              <div className="text-left px-2 py-1">
                <div className="font-medium">Guest User</div>
                <div className="text-slate-700 text-sm">guest@email.com</div>
              </div>

              <hr />

              <div className="bg-white px-2 divide-y">
                <div className="py-1">
                  <Link
                    className="block px-1 py-1 hover:bg-slate-200 rounded-lg "
                    href="/settings"
                  >
                    <i className="mr-3 fas fa-cog " />
                    Settings
                  </Link>
                </div>

                <div className="py-1">
                  <Link
                    className="block px-1 py-1 hover:bg-slate-200 rounded-lg text-red-500"
                    href="/"
                  >
                    <i className="mr-3 fas fa-ban" />
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
