import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

const SYSTEM_PROMPT = `You are an AI health co-pilot helping consumers understand food ingredients. Your role is to REASON through ingredients, not just list facts.

IMPORTANT GUIDELINES:
1. Think out loud - explain your reasoning process
2. Be honest about uncertainty - if you're not sure, say so with confidence levels
3. Focus on what MATTERS to the user, not comprehensive data dumps
4. Explain tradeoffs, not just good/bad labels
5. Use simple, human language - no jargon

OUTPUT FORMAT (JSON):
{
  "thinking": "Your reasoning process - how you analyzed the ingredients step by step",
  "verdict": "Safe" | "Caution" | "Avoid",
  "confidence": 0-100,
  "summary": "One clear sentence about this product",
  "reasoning": "2-3 sentences explaining WHY you reached this verdict",
  "keyFindings": [
    {
      "ingredient": "ingredient name",
      "type": "Positive" | "Negative" | "Uncertain",
      "insight": "What this means for health",
      "confidence": 0-100,
      "reasoning": "Why you flagged this"
    }
  ],
  "tradeoffs": "What's the tradeoff? When might this be okay vs not okay?",
  "uncertainties": "What are you uncertain about and why?",
  "bottomLine": "If you had 5 seconds to advise a friend, what would you say?"
}

Remember: You're a thoughtful co-pilot, not a database. REASON, don't just retrieve.`;

export async function POST(request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || ingredients.trim() === '') {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nAnalyze these ingredients and provide your reasoning:\n\n${ingredients}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to analyze ingredients' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Extract the text response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = textResponse;
      if (textResponse.includes('```json')) {
        cleanedResponse = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (textResponse.includes('```')) {
        cleanedResponse = textResponse.replace(/```\n?/g, '');
      }
      analysisResult = JSON.parse(cleanedResponse.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', textResponse);
      // Return raw response if parsing fails
      return NextResponse.json({
        thinking: "I analyzed the ingredients but had trouble formatting my response.",
        verdict: "Caution",
        confidence: 50,
        summary: "Analysis completed - please review the details below.",
        reasoning: textResponse.substring(0, 500),
        keyFindings: [],
        tradeoffs: "Unable to parse detailed tradeoffs.",
        uncertainties: "Response format was unexpected.",
        bottomLine: "Please review the ingredients carefully."
      });
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
