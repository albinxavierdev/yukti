import Image from "next/image";

const Header = () => {
  return (
    <div className="container h-[60px] px-4 lg:h-[80px] lg:px-0">
      <div className="grid h-full grid-cols-12">
        <div className="col-span-5"></div>
        <div className="col-span-2 flex items-center justify-center">
          <a href="/">
            <Image
              unoptimized
              src="/img/logo_dark.svg"
              alt="logo"
              width={60}
              height={59}
              className="h-[50px] w-[55px] lg:h-12 lg:w-12"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
