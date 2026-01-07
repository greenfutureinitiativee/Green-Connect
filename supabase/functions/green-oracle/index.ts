import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { prompt } = await req.json()
        // Retrieve API Key from Supabase Secrets
        const apiKey = Deno.env.get('GEMINI_API_KEY_CONNECT')

        if (!apiKey) {
            throw new Error('Gemini API Key not found in environment variables')
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        // System prompt behavior
        const systemInstruction = `You are 'GreenOracle', an AI assistant for the Green Future Connect platform in Nigeria. 
    Your purpose is to answer questions about environmental sustainability, LGA governance, waste management, and civic duties in Nigeria.
    Be helpful, concise, and encourage positive civic action. 
    If asked about things outside this scope, politely pivot back to environmental or civic topics.`

        const result = await model.generateContent(systemInstruction + "\n\nUser Question: " + prompt)
        const response = result.response;
        const text = response.text();

        return new Response(
            JSON.stringify({ answer: text }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
