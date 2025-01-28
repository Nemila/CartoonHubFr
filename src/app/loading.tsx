import Image from "next/image";

const LoadingPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Image
        width={128}
        height={128}
        alt="logo"
        src={"/logo-light.svg"}
        className="animate-pulse"
        unoptimized
      />
    </div>
  );
};

export default LoadingPage;
