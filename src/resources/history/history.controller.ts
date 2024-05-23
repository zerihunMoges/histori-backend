import { NextFunction, Request, Response } from "express";
import { config } from "../../../config";
import { History } from "./history.model";
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: config.openai });

export async function getHistories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { year, country, category, query } = req.query;

  if (year === undefined || typeof year !== "string" || country === undefined) {
    return res.status(400).json({ message: "You need to specify country and year" });
  }

  if (category === undefined) {
    category = "";
  }

  if (query === undefined) {
    query = "";
  }



  try {
    const histories = await History.find({
      start_year: { $lte: parseInt(year) },
      end_year: { $gte: parseInt(year) },
      country: { $eq: country },
      title: { $regex: query, $options: "i" },
    });

    return res.status(200).json(histories);
  } catch (error) {
    console.error("error is: ", error);
    return res.status(500).json({ message: "Server Error" });
  }
}



export async function createHistories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let {
    title,
    country,
    start_year,
    end_year,
    summary,
    content,
    categories,
    sources
  } = req.body

  // Build the Request
  const apiRequestJson = {
    messages: [
      {
        role: "system",
        content:
          "You are HakimHubAI a professional medical assistant that helps to give titles to a text. You will take the text and give a one-sentence summary of the text. It needs to be very short and concise.",
      },
      {
        role: "user",
        content: summary ? summary : content
      },
    ],
    model: "gpt-3.5-turbo",
  };

  try {
    const completion = await openai.chat.completions.create(apiRequestJson);

    const opeanai_response = JSON.parse(completion.choices[0].message.content);

    if (start_year === undefined) {
      start_year = opeanai_response.start_year;
    }
    if (end_year === undefined) {
      end_year = opeanai_response.end_year;
    }
    if (categories !== undefined) {
      categories = opeanai_response.categories;
    }

    const history = new History({
      title,
      country,
      start_year,
      end_year,
      content,
      categories,
      sources,
    });

    await history.save();

    res.status(201).json(history);

  } catch (error) {
    console.error("error is: ", error);
    res.status(500).json({ message: "Server Error" });
  }


}
