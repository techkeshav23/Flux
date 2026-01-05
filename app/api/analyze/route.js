import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are a friendly AI health assistant helping regular people (not doctors or scientists) understand food/medicine ingredients. Explain things like you're talking to a friend or family member.

CRITICAL RULES:
1. Use VERY SIMPLE language - imagine explaining to your grandmother
2. NO scientific jargon - if you must use a technical term, explain it simply
3. Use everyday examples and comparisons people can relate to
4. Be warm and conversational, not clinical
5. Focus on practical "should I eat/take this?" advice
6. Provide response in BOTH English AND Hindi

OUTPUT FORMAT (JSON):
{
  "verdict": "Safe" | "Caution" | "Avoid",
  "confidence": 0-100,
  "en": {
    "verdictLabel": "Good to go! / Be careful / Better avoid",
    "simpleSummary": "One simple sentence about this product",
    "whatIsThis": "What is this product? Simple explanation",
    "goodThings": [
      {
        "title": "Good thing name",
        "explanation": "Why this is good - very simple",
        "icon": "👍"
      }
    ],
    "concerns": [
      {
        "title": "Concern name", 
        "explanation": "Why this is concerning - simple language",
        "severity": "low" | "medium" | "high",
        "icon": "⚠️"
      }
    ],
    "whoShouldAvoid": "Who should avoid this?",
    "simpleAdvice": "5 second advice for a friend",
    "dailyLifeTip": "A practical tip for daily use"
  },
  "hi": {
    "verdictLabel": "सुरक्षित है / सावधानी रखें / इससे बचें",
    "simpleSummary": "इस प्रोडक्ट के बारे में एक आसान वाक्य",
    "whatIsThis": "यह क्या है? सरल शब्दों में",
    "goodThings": [
      {
        "title": "अच्छी बात",
        "explanation": "यह अच्छा क्यों है - बहुत आसान भाषा में",
        "icon": "👍"
      }
    ],
    "concerns": [
      {
        "title": "चिंता की बात",
        "explanation": "यह चिंता क्यों है - आसान भाषा में",
        "severity": "low" | "medium" | "high",
        "icon": "⚠️"
      }
    ],
    "whoShouldAvoid": "किन लोगों को यह नहीं लेना चाहिए?",
    "simpleAdvice": "दोस्त को 5 सेकंड में सलाह",
    "dailyLifeTip": "रोज़मर्रा की ज़िंदगी के लिए टिप"
  }
}

IMPORTANT FOR HINDI:
- Use simple Hindi that everyone understands
- Mix common English words where Indians normally use them (like "sugar", "protein", "calories", "blood pressure")
- Don't use heavy Sanskrit/formal Hindi

Remember: You're a helpful friend explaining health stuff, not a textbook!`;

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
                text: `${SYSTEM_PROMPT}\n\nAnalyze these ingredients and explain in simple terms (provide BOTH English and Hindi):\n\n${ingredients}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
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
