// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { HeadersInit } from 'node-fetch';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const API_KEY = process.env.MIDJOURNEY_API_KEY ?? '';
    const task_id = req.body.task_id;

    const res_params = JSON.stringify({
        "taskId": task_id,
        "position": 1
    });

    const res_config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.midjourneyapi.io/v2/result',
        headers: {
            'Authorization': API_KEY,
            'Content-Type': 'application/json'
        },
        data: res_params
    };
    try{
        const res_result = await axios.request(res_config);
        const data = res_result.data;
        console.log(data);
        res.status(200).json(data);
    }catch(e: any){
        res.status(200).json({});
    }
   
}
