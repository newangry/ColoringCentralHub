// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { PROMPTS } from '@/utils/server/consts';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    
    const prompt = req.body.prompt;
    const type = req.body.type;
    
    const type_prompt = PROMPTS.filter(item => item.type == type)[0].prompt??'';
    const base_prompt = `coloring page based on ${type_prompt} very thick outlines, kawaii cute, simple design, --ar 2:3 --v 4`;

    const API_KEY = process.env.MIDJOURNEY_API_KEY ?? '';
    
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
