'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession();

  const handleSubmit = () => {
    if (!session) {
      router.replace('/auth')
    }
  }

  return (
    <div className="flex items-center flex-col mx-48 mt-[8rem]">
      <p className="text-base text-[#ff950a] font-medium ">SHORTEN LINKS</p>
      <h1 className="font-extrabold text-4xl font-sans mt-4 text-center px-16">Create links that perform with our powerful URL Shortener</h1>
      <div className="flex mt-10 w-full">
        <Input className="rounded-r-none focus:outline-none w-[50rem]" placeholder="Place your long URL here" />
        <Button className="rounded-l-none" onClick={handleSubmit}>Shorten Links</Button>
      </div>
    </div>
  );
}
