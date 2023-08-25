import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const search = req.body.search??'';
    const { error, data } = await supabaseAdmin.from('coloring_images').select("*").or(`prompt.ilike.%${search}%`);
    if(!error){
        res.status(200).json(data);
    } else{
        console.log(error);
        res.status(201).json([]);
    }
}
