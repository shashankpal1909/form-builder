import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API_KEY!;

export async function generateForm(prompt: string) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "form for registration of a online webinar for data science",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Data Science Webinar Registration",\n  "sections": [\n    {\n      "title": "Personal Information",\n      "description": "Please provide your contact information below.",\n      "questions": [\n        {"content": "First Name", "type": "short", "required": true},\n        {"content": "Last Name", "type": "short", "required": true},\n        {"content": "Email Address", "type": "short", "required": true},\n        {"content": "Job Title", "type": "short", "required": false},\n        {"content": "Company", "type": "short", "required": false}\n      ]\n    },\n    {\n      "title": "Webinar Information",\n      "description": "Tell us a little about your interest in the webinar.",\n      "questions": [\n        {\n          "content": "How did you hear about this webinar?",\n          "type": "dropdown",\n          "required": false,\n          "options": [\n            {"value": "Social Media"},\n            {"value": "Email"},\n            {"value": "Search Engine"},\n            {"value": "Referral"},\n            {"value": "Other"}\n          ]\n        },\n        {\n          "content": "What are your goals for attending this webinar?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "Do you have any prior experience with data science?",\n          "type": "radio",\n          "required": false,\n          "options": [\n            {"value": "Yes"},\n            {"value": "No"}\n          ]\n        }\n      ]\n    },\n    {\n      "title": "Stay Connected",\n      "description": "Subscribe to our newsletter for more data science content.",\n      "questions": [\n        {\n          "content": "Would you like to receive our newsletter?",\n          "type": "check",\n          "required": false,\n          "options": [\n            {"value": "Yes, I would like to subscribe to the newsletter."}\n          ]\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "customer satisfaction form" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Customer Satisfaction Survey",\n  "sections": [\n    {\n      "title": "About Your Experience",\n      "description": "Tell us about your recent experience with our company.",\n      "questions": [\n        {\n          "content": "How satisfied were you with your overall experience?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Very Satisfied"},\n            {"value": "Satisfied"},\n            {"value": "Neutral"},\n            {"value": "Dissatisfied"},\n            {"value": "Very Dissatisfied"}\n          ]\n        },\n        {\n          "content": "How likely are you to recommend our company to others?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Very Likely"},\n            {"value": "Likely"},\n            {"value": "Neutral"},\n            {"value": "Unlikely"},\n            {"value": "Very Unlikely"}\n          ]\n        },\n        {\n          "content": "What did you like most about your experience?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "What could we improve?",\n          "type": "paragraph",\n          "required": false\n        }\n      ]\n    },\n    {\n      "title": "Product/Service Feedback",\n      "description": "Please provide feedback on the specific product or service you received.",\n      "questions": [\n        {\n          "content": "What product or service did you receive?",\n          "type": "short",\n          "required": false\n        },\n        {\n          "content": "How satisfied were you with the quality of the product/service?",\n          "type": "radio",\n          "required": false,\n          "options": [\n            {"value": "Very Satisfied"},\n            {"value": "Satisfied"},\n            {"value": "Neutral"},\n            {"value": "Dissatisfied"},\n            {"value": "Very Dissatisfied"}\n          ]\n        },\n        {\n          "content": "Did the product/service meet your expectations?",\n          "type": "radio",\n          "required": false,\n          "options": [\n            {"value": "Yes"},\n            {"value": "No"}\n          ]\n        },\n        {\n          "content": "If no, please explain why.",\n          "type": "paragraph",\n          "required": false\n        }\n      ]\n    },\n    {\n      "title": "Customer Service",\n      "description": "How would you rate our customer service?",\n      "questions": [\n        {\n          "content": "How responsive was our customer service team?",\n          "type": "radio",\n          "required": false,\n          "options": [\n            {"value": "Very Responsive"},\n            {"value": "Responsive"},\n            {"value": "Neutral"},\n            {"value": "Unresponsive"},\n            {"value": "Very Unresponsive"}\n          ]\n        },\n        {\n          "content": "How helpful was our customer service team?",\n          "type": "radio",\n          "required": false,\n          "options": [\n            {"value": "Very Helpful"},\n            {"value": "Helpful"},\n            {"value": "Neutral"},\n            {"value": "Unhelpful"},\n            {"value": "Very Unhelpful"}\n          ]\n        },\n        {\n          "content": "Do you have any other comments or suggestions?",\n          "type": "paragraph",\n          "required": false\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "health survey form" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Health Survey",\n  "sections": [\n    {\n      "title": "Demographic Information",\n      "description": "Please provide some basic information about yourself.",\n      "questions": [\n        {\n          "content": "Age",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "Gender",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Male"},\n            {"value": "Female"},\n            {"value": "Other"}\n          ]\n        },\n        {\n          "content": "Height (in cm)",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "Weight (in kg)",\n          "type": "short",\n          "required": true\n        }\n      ]\n    },\n    {\n      "title": "Lifestyle Habits",\n      "description": "Tell us about your daily habits and lifestyle.",\n      "questions": [\n        {\n          "content": "How many hours of sleep do you get on average per night?",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "How often do you engage in physical activity?",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "Daily"},\n            {"value": "3-5 times a week"},\n            {"value": "1-2 times a week"},\n            {"value": "Rarely"},\n            {"value": "Never"}\n          ]\n        },\n        {\n          "content": "Do you smoke?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Yes"},\n            {"value": "No"}\n          ]\n        },\n        {\n          "content": "How many alcoholic drinks do you consume per week?",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "How would you describe your diet?",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "Very Healthy"},\n            {"value": "Healthy"},\n            {"value": "Average"},\n            {"value": "Unhealthy"},\n            {"value": "Very Unhealthy"}\n          ]\n        }\n      ]\n    },\n    {\n      "title": "Medical History",\n      "description": "Please provide information about your medical history.",\n      "questions": [\n        {\n          "content": "Do you have any pre-existing medical conditions?",\n          "type": "check",\n          "required": false,\n          "options": [\n            {"value": "High Blood Pressure"},\n            {"value": "Diabetes"},\n            {"value": "Heart Disease"},\n            {"value": "Asthma"},\n            {"value": "Arthritis"},\n            {"value": "Other"}\n          ]\n        },\n        {\n          "content": "If you selected \'Other\', please specify:",\n          "type": "short",\n          "required": false\n        },\n        {\n          "content": "Are you currently taking any medications?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Yes"},\n            {"value": "No"}\n          ]\n        },\n        {\n          "content": "If yes, please list the medications:",\n          "type": "paragraph",\n          "required": false\n        }\n      ]\n    },\n    {\n      "title": "Additional Information",\n      "description": "Is there anything else you would like to share about your health?",\n      "questions": [\n        {\n          "content": "Please provide any additional information about your health or concerns.",\n          "type": "paragraph",\n          "required": false\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: 'question types supported - "radio", "date", "dropdown", "check", "short", "paragraph"',
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: 'You got it! I\'ve updated the supported question types to include "date".  Let me know if you\'d like me to generate a new form with this expanded set of question types!  For example, we could create a health survey form that asks for date of birth using the "date" type. What kind of form would you like to make?',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Product Feedback Form" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Product Feedback Form",\n  "sections": [\n    {\n      "title": "About You",\n      "description": "Help us understand your experience.",\n      "questions": [\n        {\n          "content": "Name",\n          "type": "short",\n          "required": false\n        },\n        {\n          "content": "Email",\n          "type": "short",\n          "required": false\n        }\n      ]\n    },\n    {\n      "title": "Product Usage",\n      "description": "Tell us about your experience with the product.",\n      "questions": [\n        {\n          "content": "What product are you providing feedback on?",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "When did you start using this product?",\n          "type": "date",\n          "required": false\n        },\n        {\n          "content": "How often do you use this product?",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "Daily"},\n            {"value": "Several times a week"},\n            {"value": "Weekly"},\n            {"value": "Monthly"},\n            {"value": "Less than once a month"}\n          ]\n        }\n      ]\n    },\n    {\n      "title": "Your Feedback",\n      "description": "Share your thoughts on the product.",\n      "questions": [\n        {\n          "content": "What do you like most about this product?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "What could be improved about this product?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "Would you recommend this product to others?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Yes"},\n            {"value": "No"},\n            {"value": "Maybe"}\n          ]\n        },\n        {\n          "content": "Are there any features you\'d like to see added?",\n          "type": "check",\n          "required": false,\n          "options": [\n            {"value": "Improved Performance"},\n            {"value": "Enhanced User Interface"},\n            {"value": "Additional Functionality"},\n            {"value": "Better Integration with other tools"},\n            {"value": "Other"}\n          ]\n        },\n        {\n          "content": "If you selected \'Other\', please specify:",\n          "type": "short",\n          "required": false\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "General Contact Form" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Contact Us",\n  "sections": [\n    {\n      "title": "Your Information",\n      "description": "Please provide your contact information.",\n      "questions": [\n        {\n          "content": "First Name",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "Last Name",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "Email",\n          "type": "short",\n          "required": true\n        },\n        {\n          "content": "Phone Number",\n          "type": "short",\n          "required": false\n        }\n      ]\n    },\n    {\n      "title": "Your Message",\n      "description": "Let us know how we can help you.",\n      "questions": [\n        {\n          "content": "Subject",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "General Inquiry"},\n            {"value": "Product Support"},\n            {"value": "Billing Question"},\n            {"value": "Partnership Opportunity"},\n            {"value": "Other"}\n          ]\n        },\n        {\n          "content": "Your Message",\n          "type": "paragraph",\n          "required": true\n        }\n      ]\n    },\n    {\n      "title": "Stay Connected",\n      "description": "Optional: Subscribe to our newsletter for updates.",\n      "questions": [\n        {\n          "content": "Would you like to subscribe to our newsletter?",\n          "type": "check",\n          "required": false,\n          "options": [\n            {"value": "Yes, I would like to subscribe to the newsletter."}\n          ]\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Customer Feedback Form" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Customer Feedback Form",\n  "sections": [\n    {\n      "title": "About You",\n      "description": "Help us understand your experience.",\n      "questions": [\n        {\n          "content": "Name",\n          "type": "short",\n          "required": false\n        },\n        {\n          "content": "Email",\n          "type": "short",\n          "required": false\n        },\n        {\n          "content": "Order Number",\n          "type": "short",\n          "required": false\n        }\n      ]\n    },\n    {\n      "title": "Your Feedback",\n      "description": "Tell us about your recent experience.",\n      "questions": [\n        {\n          "content": "How satisfied were you with your overall experience?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Very Satisfied"},\n            {"value": "Satisfied"},\n            {"value": "Neutral"},\n            {"value": "Dissatisfied"},\n            {"value": "Very Dissatisfied"}\n          ]\n        },\n        {\n          "content": "What did you like most about your experience?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "What could we improve?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "How likely are you to recommend us to others?",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "Very Likely"},\n            {"value": "Likely"},\n            {"value": "Neutral"},\n            {"value": "Unlikely"},\n            {"value": "Very Unlikely"}\n          ]\n        }\n      ]\n    },\n    {\n      "title": "Contact Preferences",\n      "description": "May we contact you regarding your feedback?",\n      "questions": [\n        {\n          "content": "Would you like to be contacted for further feedback?",\n          "type": "check",\n          "required": false,\n          "options": [\n            {"value": "Yes, you may contact me."}\n          ]\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Employee Feedback Survey" }],
      },
      {
        role: "model",
        parts: [
          {
            text: '```json\n{\n  "title": "Employee Feedback Survey",\n  "sections": [\n    {\n      "title": "About You",\n      "description": "Help us understand your experience.",\n      "questions": [\n        {\n          "content": "Name",\n          "type": "short",\n          "required": false\n        },\n        {\n          "content": "Department",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "Engineering"},\n            {"value": "Marketing"},\n            {"value": "Sales"},\n            {"value": "Customer Support"},\n            {"value": "Other"}\n          ]\n        },\n        {\n          "content": "Job Title",\n          "type": "short",\n          "required": true\n        }\n      ]\n    },\n    {\n      "title": "Your Feedback",\n      "description": "Tell us about your experience and areas for improvement.",\n      "questions": [\n        {\n          "content": "What do you enjoy most about working here?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "What are some areas where we could improve as a company?",\n          "type": "paragraph",\n          "required": false\n        },\n        {\n          "content": "How satisfied are you with your workload?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Very Satisfied"},\n            {"value": "Satisfied"},\n            {"value": "Neutral"},\n            {"value": "Dissatisfied"},\n            {"value": "Very Dissatisfied"}\n          ]\n        },\n        {\n          "content": "How satisfied are you with your compensation and benefits?",\n          "type": "radio",\n          "required": true,\n          "options": [\n            {"value": "Very Satisfied"},\n            {"value": "Satisfied"},\n            {"value": "Neutral"},\n            {"value": "Dissatisfied"},\n            {"value": "Very Dissatisfied"}\n          ]\n        },\n        {\n          "content": "How likely are you to recommend this company as a great place to work?",\n          "type": "dropdown",\n          "required": true,\n          "options": [\n            {"value": "Very Likely"},\n            {"value": "Likely"},\n            {"value": "Neutral"},\n            {"value": "Unlikely"},\n            {"value": "Very Unlikely"}\n          ]\n        }\n      ]\n    },\n    {\n      "title": "Additional Comments",\n      "description": "Is there anything else you would like to share?",\n      "questions": [\n        {\n          "content": "Please provide any additional feedback or comments.",\n          "type": "paragraph",\n          "required": false\n        }\n      ]\n    }\n  ]\n}\n```',
          },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text());

  return extractFormJson(response.text());
}

function extractFormJson(input: string): any | null {
  const regex = /```json\s*([\s\S]*?)```/;
  const match = regex.exec(input);

  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  return null;
}
