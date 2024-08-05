import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gpt";

export async function searchYoutube(searchQuery: string) {
  // hello world => hello+world
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );
  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("youtube fail");
    return null;
  }
  return data.items[0].id.videoId;
}

export async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

export async function getQuestionsFromTranscript(
  transcript: string,
  course_title: string
) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };
  const questions: Question[] = await strict_output(
    "You are an AI specialized in generating MCQ questions and answers. Each answer must not exceed 10 words. The response should be in JSON format only, with no conversational text.",
    new Array(5).fill(
      `Generate a random hard MCQ questions about ${course_title} based on the following transcript: ${transcript}. Output only the JSON object without any conversational text.`
    ),
    {
      question: "Question with a maximum length of 15 words",
      answer: "answer with max length of 10 words (correct option)",
      option1: "option1 with max length of 10 words (wrong option)",
      option2: "option2 with max length of 10 words (wrong option)",
      option3: "option3 with max length of 10 words (wrong option)",
    }
  );
  return questions;
}