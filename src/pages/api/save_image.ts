
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    
    const image_url = req.body.image;
    const type = req.body.type;
    const prompt = req.body.prompt;
    
    console.log(type);

    const { error } = await supabaseAdmin.from('coloring_images').insert([{
        image_url,
        type,
        prompt
    }]);

    if(!error){
        res.status(200).json({message: 'success'})
    } else {
        console.log(error);
        res.status(201).json({message: error})
    }
}
