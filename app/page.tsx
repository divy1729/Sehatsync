import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* to do: otp verification | passkey modal */}
      <section className="container flex-1 flex justify-center items-center">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="Patient"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />
          <div className="text-14-regular mt-15 flex justify-between">
            <p className="text-dark-600 xl:text-left">© 2024 CarePulse</p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="Patient"
        className="max-w-[50%] h-auto object-cover"
      />
    </div>
  );
}
