"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form} from "@/components/ui/form"

import { Section } from "lucide-react"
import CustomFormField from "../ui/CustomFormField"
import SubmitButton from "../ui/SubmitButton"

import { UserFormValidation } from "@/lib/validation"
import router from "next/router";
import { createUser } from "@/lib/actions/patient.actions";
export enum FormFieldType{
  INPUT= 'input',
  TEXTAREA='textarea',
  PHONE_INPUT='phoneinput',
  CHECKBOX='checkbox',
  DATE_PICKER='datePicker',
  SELECT='select',
  SKELETON ='skeleton',
 
}
 

 
const PatientForm=() => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

     
      if (newUser) {
        // newUser is not null, so it's safe to access its properties
        console.log("User ID:", newUser.$id);
        router.push(`/patients/${newUser.$id}/register`);
      } else {
        // Handle the case where newUser is null
        console.error("Failed to create or retrieve user.");
      }
    } catch (error) {
      console.log("Error during user creation:", error);
    } finally {
      setIsLoading(false);
    }
  };


 

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  flex-1">
      <section className="mb-12 space-y-4"> 
      <h2 className="header">Hi There 🐱‍💻</h2>
      <p className=" text-dark-700">Schedule your first appointment</p>
      </section>
      
      <CustomFormField
       fieldType={FormFieldType.INPUT}
       control={form.control}
       name = 'name'
       label='Full name'
       placeholder= 'Divyansh Saxena'
       iconSrc="/assets/icons/user.svg"
       iconAlt="user"
      />
       <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="divy@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="9876543210"
        />
      
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
)
  
}

export default PatientForm

