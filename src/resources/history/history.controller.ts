import { Request, Response, NextFunction } from "express";
import { History } from "./history.model";
import { config } from "../../../config";
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: config.openai });

export async function getHistories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { year, country, category, query } = req.query;

  if (year === undefined || typeof year !== "string" || country === undefined) {
    return res.status(400).json({ message: "Invalid query" });
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
      end_year: { $gte: parseInt(year)},
      country: {$eq: country},
      title: {$regex: query, $options: "i"},
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
          "You are a history api, you only provide json format answers only. I will provide you with a historical article and you will provide with the start_year, end_year, and categories(category is what the article is about it could be talking about a city, institution, a battle, a war) for the article. You will do this in a json format. e.g. {start_year: '2020', end_year: '2020', categories: ['battle']}. don't have newline symbols or anything. keep in mind that {\n  'start_year': 1850,\n  'end_year': 1850\n, 'categories': ['battle']\n} is not valid since it has a newline symbol which means it can not be parsed as a json.  if you can't find the start_year or end_year leave them as null, if you can't find categories leave it as an empty string. e.g. {start_year: null, end_year: null, categories: []}. Always follow the rule of providing the answer in json format without newline symbol.",
      },
      {
        role: "user",
        content: summary ? summary : content},
    ],
    model: "gpt-3.5-turbo",
  };

  try {
    const completion = await openai.chat.completions.create(apiRequestJson);

    const opeanai_response = JSON.parse(completion.choices[0].message.content);

    if(start_year === undefined){
      start_year = opeanai_response.start_year;
    }
    if(end_year === undefined){
      end_year = opeanai_response.end_year;
    }
    if(categories !== undefined){
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
