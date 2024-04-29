import { Report } from "./report.model";


export async function getHistoryReports({ start_year, end_year, country, categories }) {
    try {
        const pipeline: any[] = [
            {
                $lookup: {
                    from: "histories",
                    localField: "content_id",
                    foreignField: "_id",
                    as: "content"
                }
            },
        ];

        const matchStage = {};

        if (country) {
            matchStage["content.country"] = country;
        }

        if (start_year && end_year) {
            matchStage["content.start_year"] = { $gte: start_year };
            matchStage["content.end_year"] = { $lte: end_year };
        }

        if (categories && categories.length > 0) {
            matchStage["content.categories"] = { $in: categories };
        }

        // Add the $match stage if any conditions are specified
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        var reports = Report.aggregate(pipeline);

        return reports
    } catch (error) {
        throw Error(error)
    }
}



// export async function createReports(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     let {
//         title,
//         country,
//         start_year,
//         end_year,
//         summary,
//         content,
//         categories,
//         sources
//     } = req.body

//     // Build the Request
//     const apiRequestJson = {
//         messages: [
//             {
//                 role: "system",
//                 content:
//                     "You are a Report api, you only provide json format answers only. I will provide you with a historical article and you will provide with the start_year, end_year, and categories(category is what the article is about it could be talking about a city, institution, a battle, a war) for the article. You will do this in a json format. e.g. {start_year: '2020', end_year: '2020', categories: ['battle']}. don't have newline symbols or anything. keep in mind that {\n  'start_year': 1850,\n  'end_year': 1850\n, 'categories': ['battle']\n} is not valid since it has a newline symbol which means it can not be parsed as a json.  if you can't find the start_year or end_year leave them as null, if you can't find categories leave it as an empty string. e.g. {start_year: null, end_year: null, categories: []}. Always follow the rule of providing the answer in json format without newline symbol.",
//             },
//             {
//                 role: "user",
//                 content: summary ? summary : content
//             },
//         ],
//         model: "gpt-3.5-turbo",
//     };

//     try {
//         const completion = await openai.chat.completions.create(apiRequestJson);

//         const opeanai_response = JSON.parse(completion.choices[0].message.content);

//         if (start_year === undefined) {
//             start_year = opeanai_response.start_year;
//         }
//         if (end_year === undefined) {
//             end_year = opeanai_response.end_year;
//         }
//         if (categories !== undefined) {
//             categories = opeanai_response.categories;
//         }

//         const Report = new Report({
//             title,
//             country,
//             start_year,
//             end_year,
//             content,
//             categories,
//             sources,
//         });

//         await Report.save();

//         res.status(201).json(Report);

//     } catch (error) {
//         console.error("error is: ", error);
//         res.status(500).json({ message: "Server Error" });
//     }


// }
