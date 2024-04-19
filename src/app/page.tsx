
import Image from "next/image";

import { Button } from "@/components/ui/button";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input";
import MailForm from "@/components/MailForm/MailForm";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      {/* <Input /> */}
      {/* <Button className="pr-10 pl-10">submit</Button> */}
      
      <h2 className="font-bold text-3xl mb-4 text-center">Contact Form</h2>

      <MailForm />

    </main>
  )
}
