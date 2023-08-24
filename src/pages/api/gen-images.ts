// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { HeadersInit } from 'node-fetch';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const base_prompt = 'coloring page cartoon style, thick lines, no shadow, blank background color, only back and white,low detail, no shading –ar 9:11 –v 5';
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
            const taskId = image_data.taskId;
            console.log(taskId);
            waitGenerating(taskId, API_KEY, res);
        }
    }catch(e:any){
        console.log(e.response.statusText);
    }
   
}

async function waitGenerating(taskId: string, API_KEY: string, res: any) {
    setTimeout(async function () {
        const response = await getMidImage(taskId, API_KEY);
        if(response.status == 200){
            const result = response.data;
            console.log(result);
            if (Object.keys(result).includes('imageURL')) {
                res.status(200).json(result);
            } else {
                waitGenerating(taskId, API_KEY, res);
            }
        } else {
            res.status(200).json({});
        }
    }, 0);
}

async function getMidImage(task_id: string, API_KEY: string) {
    const res_params = JSON.stringify({
        "taskId": task_id
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
        return res_result;
    }catch(e: any){
        console.log(e.response.statusText);
        console.log(e.response.status);
        if(e.response.status != 400 && e.response.status != 401){
            return {status: 200, data: {}}
        } else {
            return {status: 201, data: {}}
        }
    }
}
