// /api/course/createChapters

import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/db";
// import { getAuthSession } from "@/lib/auth";
// import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request, res: Response) {
  try {
    console.log("Starting POST request");
    // const session = await getAuthSession();
    // if (!session?.user) {
    //   return new NextResponse("unauthorised", { status: 401 });
    // }
    // const isPro = await checkSubscription();
    // if (session.user.credits <= 0 && !isPro) {
    //   return new NextResponse("no credits", { status: 402 });
    // }
    const body = await req.json();
    const { title, units } = createChaptersSchema.parse(body);

    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    }[];

    console.log("About to call strict_output for output_units");

    let output_units: outputUnits = await strict_output(
      "You are an AI course content curator. Your task is to create detailed chapter outlines with relevant titles and YouTube search queries.",
      units.map(unit => 
        `Create a structured outline for the unit "${unit}" in the course "${title}, with 'title' and as key for unit title". 
        1. Provide exactly 2 chapters for this unit. 
        2. For each chapter, include:
           - A clear, concise chapter title 
           - A specific YouTube search query to find an educational video on the chapter's topic
        Format your response as a JSON object. Do not include any explanatory text outside the JSON structure.`
      ),
      {
        title: "The exact title of the unit as provided",
        chapters: "An array containing exactly 2 chapter objects. Each chapter object must have 'youtube_search_query' and 'chapter_title' as keys",
      }
    );

    console.log("Received output_units:", output_units);

    const imageSearchTerm = await strict_output(
      "you are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API. Provide your output as the JSON object only and dont include any coversational words in your response.`,
      {
        image_search_term: "a good search term for the title of the course",
      }
    );

    const course_image = await getUnsplashImage(
      imageSearchTerm.image_search_term
    );
    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });

    for (const unit of output_units) {
      console.log(unit)
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }
    // await prisma.user.update({
    //   where: {
    //     id: session.user.id,
    //   },
    //   data: {
    //     credits: {
    //       decrement: 1,
    //     },
    //   },
    // });

    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
  }
}