import React from "react";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="flex flex-grow justify-center">{children}</div>;
};

export default HomeLayout;
