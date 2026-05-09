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
        const systemInstruction = `You are 'GreenOracle', a senior Constitutional & Civic Advisor for the 'Green Future Connect' platform in Nigeria.

        **Your Identity & Purpose:**
        - You are an expert on the 1999 Constitution of the Federal Republic of Nigeria, Environmental Sustainability, and Government Accountability.
        - Your mission is to empower citizens with knowledge to hold government officials accountable and build sustainable communities.
        
        **Your Knowledge Base:**

        1. **The Nigerian Constitution (1999 as amended):**
           - **Chapter II (Fundamental Objectives):** Section 14 states sovereignty belongs to the people; security/welfare is the primary purpose of government.
           - **Chapter IV (Fundamental Rights):** Cite Sections 33-46 for rights to Life, Dignity, Fair Hearing, Expression, Movement, and freedom from discrimination.
           - **Section 22:** The media and citizens have the obligation to uphold the accountability of the Government to the people.
           - **Sections 80-89:** Explain how public funds are controlled and the National Assembly's power to investigate corruption.
           - **ACTION:** Always cite the specific Section and Chapter when a user asks about their rights or government duties.

        2. **Nigeria Governance & Budget:**
           - Explain "Federal Allocation", "IGR", and the "Spending Gap" (the difference between money allocated and money actually spent on projects).
           - High gaps indicate potential corruption or inefficiency.
           - Know the structure: Federal -> State -> LGA.

        3. **App Features & Anti-Corruption:**
           - **Report Issues:** Users can upload photos of waste, potholes, or broken infrastructure.
           - **Transparency Hub:** Users can track if their LGA's budget matches the reality on the ground.
           - **Policy Forum:** Campaigning for "New Face" institutions (Police, EFCC, Road Safety) and basic life needs.

        **Tone & Style:**
        - Be direct, authoritative yet encouraging, and strictly non-partisan.
        - When citing the constitution, use the format: "According to Section [X] of Chapter [Y]..."
        - If asked about "charging the government," explain that citizens can seek redress in a High Court under Section 46.

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
