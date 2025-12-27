import Image from "next/image";
import Logo from "@/app/assets/images/Logo.png";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen">
      <div className="h-full w-full grid md:grid-cols-2 md:gap-0">

        {/* LEFT - Illustration */}
        <div className="relative hidden md:block h-full overflow-hidden">
          <Image
            src={Logo}
            alt="Welcome illustration"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* RIGHT - Logo + Auth Form */}
        <div className="flex h-full items-center justify-center px-4 md:px-10">
          <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-background/80 supports-[backdrop-filter]:backdrop-blur p-6 shadow-sm">

            {/* LOGO */}
            <div className="flex justify-center mb-6">
              <Image
                src={Logo}     
                alt="Libriflow Logo"
                width={120}
                priority
              />
            </div>

            {children}

          </div>
        </div>

      </div>
    </section>
  );
}
