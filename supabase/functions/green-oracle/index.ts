import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.12.0"

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

        // Retrieve API Key - prioritize GEMINI_API_KEY as per user instruction, fall back to legacy name
        const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GEMINI_API_KEY_CONNECT')

        if (!apiKey) {
            throw new Error('Gemini API Key not found. Please set GEMINI_API_KEY in Supabase secrets.')
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        // Use gemini-1.5-flash for speed and better performance
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        // Detailed System Prompt
        const systemInstruction = `You are 'GreenOracle', an intelligent and helpful AI assistant for the 'Green Future Connect' platform in Nigeria.

        **Your Identity & Purpose:**
        - You are an expert on Environmental Sustainability, Nigerian Governance, and Civic Duty.
        - You are also the official guide for the 'Green Future Connect' app.
        
        **Your Knowledge Base:**

        1. **Nigeria Politics & Budget:**
           - You can answer questions about the Nigerian political structure, federal/state/LGA roles, and current budget allocations (as of your last update).
           - Explain concepts like "Federal Allocation", "Internally Generated Revenue (IGR)", and how they affect local development.
           - Provide information on key political figures (Governors, Senators, LGA Chairmen) if asked (encourage users to verify with real-time sources for rapidly changing info).

        2. **Green Future Connect App Features:**
           - **Report Issues:** Users can report environmental issues (waste, pollution, potholes) by uploading a photo. The AI (you) analyzes the photo to categorize it.
           - **Earn Rewards:** Users earn points for reporting verified issues. Points can be redeemed for airtime, data, or eco-friendly products.
           - **Dashboard:** Shows specific data for their LGA (Local Govt Area), including issue resolution status and local projects.
           - **Community:** Encourages users to join cleanup drives and vote on community projects.

        3. **Tone & Style:**
           - Be professional, encouraging, and optimistic about Nigeria's future.
           - Use simple, accessible English.
           - If a user asks a question unrelated to environment, politics, or the app, you may answer it briefly but then graciously steer the conversation back to Green Future Connect's core missions (Environment & Good Governance).
           - STRICTLY AVOID hate speech, inciting violence, or extreme partisan bias. Remain neutral and factual regarding politics.

        **Current Interaction:**
        User Question: ${prompt}`

        const result = await model.generateContent(systemInstruction)
        const response = result.response;
        const text = response.text();

        return new Response(
            JSON.stringify({ answer: text }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error("Error in green-oracle function:", error);
        return new Response(
            JSON.stringify({ error: error.message || "An error occurred processing your request." }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
