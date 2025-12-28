const VALID_LOCATIONS = [
  "MAIN_BUILDING",
  "LHC_A",
  "LHC_B",
  "LHC_C",
  "CCC",
  "DIGITAL_LIBRARY",
  "LIBRARY",
  "SPORTS_COMPLEX",
  "OSC",
  "PAVILION",
  "MAIN_GROUND",
  "NSC_AREA",
  "MEGA_TOWER",
  "ATB",
  "SJA",
  "GUEST_HOUSE",
  "BEACH",
  "LIGHTHOUSE",
  "UNKNOWN",
];

const VALID_CATEGORIES = ["TECH", "CULTURAL", "SPORTS", "WORKSHOP", "OTHER"];

const parseEvent = async (text) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const now = new Date();
  const currentDateString = now.toDateString();
  const prompt = `
You are an AI assistant for NITK Surathkal campus events.
Current System Date:"${currentDateString}",
Analyze this text: "${text}"

Task:
1. Extract the Event Title.
2. Identify the Category: Must be one of: TECH, CULTURAL, SPORTS, WORKSHOP, OTHER.
3. Identify if Food/Refreshments/Pizza are provided (true/false).
4. Map the location to EXACTLY ONE of these IDs: ${VALID_LOCATIONS.join(", ")}.
  - "DL" / "Digital Library" → "DIGITAL_LIBRARY"
  - "Library" / "Central Library" → "LIBRARY"
  - "CCC" → "CCC"
  - "Main Block" / "Main Building" → "MAIN_BUILDING"
  - "LHC" (unspecified) → "LHC_C"
  - "Beach" → "BEACH"
  - "Lighthouse" → "LIGHTHOUSE"
  - "Old Sports Complex" / "OSC" → "OSC"
  - "New Sports Complex" → "NSC_AREA"
  - "Main Ground" → "MAIN_GROUND"
  - "Pavilion" → "PAVILION"
  - "SJA" / "Silver Jubilee" → "SJA"
  - If location is vague, choose the closest academic building; if still uncertain, use "UNKNOWN".
5. Don't invent start_time and end_time .Extract start and end times from the text(if start time is not mentioned then make start time and end time both as null ans if end time is not mentioned then make it one hour after start time) and then express them in Date object format.
6. Create a short 1-sentence description .
7. If year is not mentioned assume it's the system current year.

Output JSON ONLY (no markdown):
{
    "title": "string",
    "category": "string (one of TECH, CULTURAL, SPORTS, WORKSHOP, OTHER)",
    "locationId": "string (must be one of the IDs listed above)",
    "hasFood": boolean,
    "description": "string",
    "start_time": timestamp || null,
    "end_time":timestamp || null,
    "club":"string(optional)",
}
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback) {
        console.error("Safety/Prompt Feedback:", data.promptFeedback);
        throw new Error(
          `Gemini blocked the prompt. Reason: ${JSON.stringify(
            data.promptFeedback
          )}`
        );
      }
      throw new Error(
        "Gemini API returned an empty response. Check your API key and permissions."
      );
    }

    if (!data.candidates[0].content) {
      throw new Error("Gemini returned a candidate but no content.");
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const jsonStr = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    // Validate and normalize
    const category = VALID_CATEGORIES.includes(parsed.category?.toUpperCase())
      ? parsed.category.toUpperCase()
      : "OTHER";

    const locationId = VALID_LOCATIONS.includes(parsed.locationId)
      ? parsed.locationId
      : null;

    if (!locationId) {
      throw new Error(
        `Invalid location: ${
          parsed.locationId
        }. Must be one of: ${VALID_LOCATIONS.join(", ")}`
      );
    }
    const startTime = parsed.start_time ? new Date(parsed.start_time) : null;
    let endTime = parsed.end_time ? new Date(parsed.end_time) : null;

    // adding 1 hour if end time is not given
    if (startTime && !endTime) {
      endTime = new Date(startTime.getTime() + 3600000);
    }

    return {
      title: parsed.title || "Untitled Event",
      category,
      locationId,
      hasFood: parsed.hasFood === true,
      description: parsed.description || "",
      start_time: startTime,
      end_time: endTime,
      club: parsed.club ? parsed.club.toUpperCase() : null,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export { parseEvent };
