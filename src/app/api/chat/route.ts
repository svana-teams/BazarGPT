import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to call Perplexity API
async function callPerplexityAPI(productName: string) {
  try {
    console.log('Perplexity API Key exists:', !!process.env.PERPLEXITY_API_KEY);
    console.log('Product name:', productName);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: `Okay now I want you to search on Indiamart for ${productName} and list out the top 10 suppliers, if you get a text box for OTP then try cancelling or scrolling past that. After that you will take these top 10 suppliers and search for their phone numbers, discard all the numbers which start with 79 and 80, they also may be prefixed with +91 std code, and then return me supplier, their number and source of the number`
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error details:', response.status, errorText);
      throw new Error(`Perplexity API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No results found';
  } catch (error) {
    console.error('Perplexity API error:', error);
    return 'Error fetching supplier data';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Use AI to determine if we should search for suppliers
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const analysisPrompt = `Analyze this conversation and determine if we have enough information to search for suppliers. 

Conversation:
${conversationText}

Respond with ONLY "YES" if we have a product name and the user seems ready to search for suppliers, otherwise respond with "NO".`;

    const analysisCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: analysisPrompt }],
      max_tokens: 10,
      temperature: 0,
    });

    const shouldSearch = analysisCompletion.choices[0]?.message?.content?.trim().toUpperCase() === 'YES';
    
    console.log('=== DEBUG START ===');
    console.log('Conversation:', conversationText);
    console.log('Should search:', shouldSearch);
    console.log('=== DEBUG END ===');

    // If AI determines we should search, call Perplexity API
    if (shouldSearch) {
      const productName = messages.find(m => m.role === 'user')?.content || 'product';
      console.log('Calling Perplexity API for:', productName);
      const perplexityResults = await callPerplexityAPI(productName);
      
      return NextResponse.json({ 
        response: `Here are the top suppliers for ${productName}:\n\n${perplexityResults}`,
        isSearchComplete: true 
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful B2B supplier finder assistant. Your role is to help users find suppliers for their business needs.

Guidelines:
- Be conversational and helpful
- Follow this EXACT order: 1) Quantity 2) Location 3) Specific requirements
- Keep responses concise and natural
- Don't repeat questions that have already been answered
- Guide users through the supplier search process step by step
- If user provides a product name, acknowledge it and ask for quantity with appropriate units
- Use contextual examples based on the product type when asking for quantity
- CRITICAL: Never respond with more than 15 words at a time`
        },
        ...messages
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
