import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container flex items-center justify-between gap-4 py-4 text-sm">
        <div className="flex gap-4">
          <Link href="https://discord.gg/M7gRTuXc6d">Discord</Link>
          <Link href="https://www.instagram.com/cartoonhub_fr/">Instagram</Link>
        </div>

        <p>CartoonHub By Nemila | 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
