import { ReactNode } from "react";
import Aside from "../../components/ui/Aside";
import PageHeader from "../../components/ui/PageHeader";
import Reader from "../../components/Reader";

const StorageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-row flex-nowrap h-full text-custom-text-light dark:text-custom-text-dark">
      <Aside />

      <div className="flex flex-col flex-nowrap flex-grow relative w-0 overflow-x-hidden bg-custom-bg-off-light dark:bg-custom-bg-off-dark">
        <Reader />
        <PageHeader />
        {children}
      </div>
    </div>
  );
};

export default StorageLayout;
