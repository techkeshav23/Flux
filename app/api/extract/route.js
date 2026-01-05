import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

const OCR_PROMPT = `You are an expert at reading food product ingredient labels from images.

TASK: Extract the ingredients list from this image.

INSTRUCTIONS:
1. Look for the "Ingredients:" or similar section on the product label
2. Extract ALL ingredients exactly as written
3. If you can't find ingredients or the image is unclear, say so honestly
4. Don't make up ingredients - only extract what you can actually see

OUTPUT FORMAT:
Return ONLY a JSON object in this exact format:
{
  "success": true/false,
  "ingredients": "comma-separated list of ingredients exactly as shown on label",
  "confidence": 0-100,
  "notes": "any relevant notes about image quality or partial visibility"
}

If you cannot read the ingredients (blurry, no label visible, etc.):
{
  "success": false,
  "ingredients": "",
  "confidence": 0,
  "notes": "explanation of why extraction failed"
}

Be accurate - users are relying on this for health decisions.`;

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

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
                text: OCR_PROMPT
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini Vision API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to process image' },
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

    // Parse JSON from response
    let extractionResult;
    try {
      let cleanedResponse = textResponse;
      if (textResponse.includes('```json')) {
        cleanedResponse = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (textResponse.includes('```')) {
        cleanedResponse = textResponse.replace(/```\n?/g, '');
      }
      extractionResult = JSON.parse(cleanedResponse.trim());
    } catch (parseError) {
      console.error('Failed to parse OCR response:', textResponse);
      return NextResponse.json({
        success: false,
        ingredients: '',
        confidence: 0,
        notes: 'Failed to parse the extracted text. Please try again or paste ingredients manually.'
      });
    }

    return NextResponse.json(extractionResult);

  } catch (error) {
    console.error('Image extraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
