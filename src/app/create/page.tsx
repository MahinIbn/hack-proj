// import { getAuthSession } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import CreateCourseForm from "@/components/CreateCourseForm";
// import { checkSubscription } from "@/lib/subscription";

type Props = {};

const CreatePage = async (props: Props) => {
//   const session = await getAuthSession();
//   if (!session?.user) {
//     return redirect("/gallery");
//   }
//   const isPro = await checkSubscription();
  return (
    <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-16 sm:px-0">
      <h1 className="self-center text-xl font-bold text-center sm:text-6xl">
        What do you want to learn today?
      </h1>
      <div className="flex p-4 mt-5 border-none bg-secondary">
        <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          Enter the topic that you want to explore. Falcon Tutor
          will generate a personalized course that is tailored just for you!
        </div>
      </div>

      <CreateCourseForm/>
    </div>
  );
};

export default CreatePage;