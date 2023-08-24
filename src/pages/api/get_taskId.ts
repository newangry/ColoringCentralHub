// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const base_prompt = 'coloring page thick lines, no shadow, blank background color, only back and white,low detail, no shading and I want one full image,';
    const prompt = req.body.prompt;
    const API_KEY = process.env.MIDJOURNEY_API_KEY ?? '';
    // const image_data =
    const image_params = JSON.stringify({
        "prompt": `coloring book page:: ${prompt} ${base_prompt}`
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.midjourneyapi.io/v2/imagine',
        headers: {
            'Authorization': API_KEY,
            'Content-Type': 'application/json'
        },
        data: image_params
    };
    try{
        const image_res = await axios.request(config);

        if (image_res.status == 200) {
            const image_data = image_res.data;
            res.status(200).json(image_data);
        }
    }catch(e:any){
        // console.log(e.response.statusText);
        res.status(201).json({msg: e.response.statusText})
    }
   
}
