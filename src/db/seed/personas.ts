import { NewPersona } from '../drizzle/schema';

// 3 personas, with 3 scenarios each
export const personasSeed: NewPersona[] = [
  {
    name: 'John Doe',
    role: 'Customer Service Representative',
    tone: 'Friendly and practical',
    oceanOpenness: 70,
    oceanConscientiousness: 80,
    oceanExtraversion: 75,
    oceanAgreeableness: 85,
    oceanNeuroticism: 35,
    scenarios: [
      {
        callId: 428391,
        service: 'Billing',
        subject: 'Refund Request',
        notes:
          'User is requesting a refund for a recent payment that appears incorrect.',
        responses: {
          initial:
            "Hi {username}! This is John from support. I can help with your refund. Could you tell me which payment you're referring to?",
          default:
            'No problem, I just need a bit more info about the charge so I can look it up.',
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi there! I can help with your refund. Which payment are you referring to?',
            },
            {
              triggers: [
                'refund',
                'charge',
                'payment',
                'amount',
                '$',
                'usd',
                'merchant',
                'vendor',
                'store',
              ],
              response:
                'Got it, thanks! When did you notice the charge, or was it linked to a specific purchase?',
            },
            {
              triggers: [
                'date',
                'when',
                'yesterday',
                'last week',
                'today',
                'tomorrow',
                'on',
              ],
              response:
                'Thanks! That helps narrow it down. Did the amount show up on your card or an online invoice?',
            },
            {
              triggers: ['card', 'invoice', 'receipt', 'statement', 'bank'],
              response:
                "Perfect. I'll check that record. Once confirmed, would you like the refund to go back to the same payment method?",
            },
            {
              triggers: ['same', 'different', 'account', 'method', 'card'],
              response:
                'Understood. I can process it that way. It usually takes 3-5 business days. Does that work for you?',
            },
            {
              triggers: [
                'yes',
                'ok',
                'okay',
                'fine',
                'works',
                'sure',
                'sounds good',
                'agree',
              ],
              response:
                "Great! I'll submit your refund now. You'll get a confirmation email once it's processed.",
            },
          ],
        },
      },
      {
        callId: 517839,
        service: 'Scheduling',
        subject: 'Reschedule Appointment',
        notes: 'User wants to move a planned appointment to a new date.',
        responses: {
          initial:
            'Hey there {username}, this is John. I can help you move your appointment. What date were you hoping for instead?',
          default: "No problem, let's find a new time that fits your schedule.",
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi! I can help move your appointment. What date were you hoping for instead?',
            },
            {
              triggers: [
                'reschedule',
                'move',
                'change',
                'shift',
                'push',
                'pull',
              ],
              response:
                'Sure thing! When was your original appointment supposed to happen?',
            },
            {
              triggers: ['original', 'old', 'was', 'previous', 'before'],
              response:
                'Got it. Are you looking for an earlier date, or a bit later?',
            },
            {
              triggers: [
                'earlier',
                'later',
                'next week',
                'tomorrow',
                'today',
                'soon',
              ],
              response:
                "Okay! I'll check availability around that time. Do you prefer mornings or afternoons?",
            },
            {
              triggers: ['morning', 'afternoon', 'evening', 'am', 'pm'],
              response:
                'Perfect. Once I update it, would you like a text or email confirmation?',
            },
            {
              triggers: ['email', 'text', 'sms', 'message', 'notify'],
              response:
                "Done! You'll get a confirmation shortly with the new appointment details.",
            },
          ],
        },
      },
      {
        callId: 662814,
        service: 'General Inquiry',
        subject: 'Information Request',
        notes: 'User needs clarification on a process or policy.',
        responses: {
          initial:
            'Hi {username}, John here. What information can I clarify for you today?',
          default:
            "Sure, I can look that up. Could you tell me what part of the process you're asking about?",
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response: 'Hi! What information can I clarify for you today?',
            },
            {
              triggers: ['policy', 'process', 'how', 'guide', 'instructions'],
              response:
                'I can explain that. Are you asking about the first step, or what happens afterward?',
            },
            {
              triggers: ['first', 'after', 'step', 'start', 'next'],
              response:
                'Right, the first step usually involves verification. Do you already have your reference ID handy?',
            },
            {
              triggers: ['id', 'reference', 'code', 'ref', 'number'],
              response:
                "Thanks! That'll help me pull the correct info. Would you like a quick summary of the procedure?",
            },
            {
              triggers: ['summary', 'overview', 'explain', 'details'],
              response:
                "Sure thing. It's a 3 step process: verification, confirmation, and final approval. Want me to break that down?",
            },
            {
              triggers: ['yes', 'ok', 'okay', 'please', 'sure', 'yep'],
              response:
                "Here's how it works step by step… I'll make sure it's easy to follow!",
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Jane Smith',
    role: 'Technical Support Specialist',
    tone: 'Calm and analytical',
    oceanOpenness: 80,
    oceanConscientiousness: 95,
    oceanExtraversion: 50,
    oceanAgreeableness: 70,
    oceanNeuroticism: 25,
    scenarios: [
      {
        callId: 593247,
        service: 'Technical Support',
        subject: 'Login Issue',
        notes: 'User cannot log into their account and is unsure why.',
        responses: {
          initial:
            'Hello {username}, this is Jane from tech support. Can you describe what happens when you try to log in?',
          default:
            "Let's get you back in. Could you tell me if you're seeing an error message?",
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hello! Can you describe what happens when you try to log in?',
            },
            {
              triggers: [
                'error',
                'message',
                'code',
                '401',
                '403',
                '404',
                '500',
              ],
              response:
                'Good detail, what does the error say exactly, or could you paraphrase it?',
            },
            {
              triggers: ['password', 'forgot', 'reset', 'pwd', 'forgotten'],
              response:
                'No problem. Have you already tried resetting your password using the reset link?',
            },
            {
              triggers: ['link', 'email', 'reset', 'otp', 'code', 'magic'],
              response:
                "Alright. If that didn't work, let's check if your account's verification status is up to date.",
            },
            {
              triggers: [
                'verified',
                'update',
                'status',
                'verify',
                '2fa',
                'mfa',
              ],
              response:
                'Perfect. Once verified, you should be able to log in. Would you like me to walk you through it?',
            },
            {
              triggers: ['yes', 'please', 'sure', 'ok', 'okay'],
              response:
                "Great, I'll guide you step by step until you're logged back in.",
            },
          ],
        },
      },
      {
        callId: 784622,
        service: 'Setup Assistance',
        subject: 'Device Configuration',
        notes: 'User needs help setting up a new device connection.',
        responses: {
          initial:
            'Hi {username}, Jane here. I can help with the setup. What type of device are you connecting?',
          default:
            "That's fine, we'll go through it together. What's the make or model of your device?",
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi! I can help with the setup. What type of device are you connecting?',
            },
            {
              triggers: ['phone', 'tablet', 'laptop', 'pc', 'desktop'],
              response:
                'Thanks! Is it connecting via Wi-Fi, Bluetooth, or a cable?',
            },
            {
              triggers: [
                'wifi',
                'wi-fi',
                'wireless',
                'bluetooth',
                'bt',
                'cable',
                'usb',
              ],
              response:
                "Okay. Let's confirm the device is powered on and in pairing mode, could you check that?",
            },
            {
              triggers: ['yes', 'checked', 'on', 'done', 'ok', 'okay'],
              response:
                'Perfect. Now look for your network name on the device, do you see it listed?',
            },
            {
              triggers: ['found', 'see', 'listed', 'visible', 'shown'],
              response:
                'Great. Select it and enter the passkey if prompted. Did it connect successfully?',
            },
            {
              triggers: ['connected', 'success', 'working', 'paired'],
              response:
                "Excellent! That means everything's configured properly. You're all set.",
            },
          ],
        },
      },
      {
        callId: 891377,
        service: 'Troubleshooting',
        subject: 'Slow Performance',
        notes: 'User reports their system running slower than usual.',
        responses: {
          initial:
            "Hi {username}, this is Jane. I can help figure out what's slowing things down. How long has this been happening?",
          default:
            "Understood, we'll narrow it down. Is it slow on startup, or when running specific programs?",
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                "Hi! I can help figure out what's slowing things down. How long has this been happening?",
            },
            {
              triggers: ['startup', 'boot', 'turn on', 'booting', 'start'],
              response:
                'Got it. It could be startup processes. Would you like me to guide you through checking them?',
            },
            {
              triggers: ['program', 'app', 'software', 'application', 'tool'],
              response:
                'Okay. Which program seems to cause the biggest slowdown?',
            },
            {
              triggers: ['browser', 'excel', 'video', 'chrome', 'firefox'],
              response:
                'Thanks. That helps identify resource usage. Want to check background tasks next?',
            },
            {
              triggers: ['yes', 'okay', 'sure', 'ok'],
              response:
                'Good call. Open your task manager, do you see any processes using high CPU or memory?',
            },
            {
              triggers: ['high', 'cpu', 'memory', 'ram'],
              response:
                'There it is. Ending or updating that program should fix the lag. You handled that well!',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Juan Garcia',
    role: 'Operations Coordinator',
    tone: 'Casual and upbeat',
    oceanOpenness: 85,
    oceanConscientiousness: 60,
    oceanExtraversion: 90,
    oceanAgreeableness: 80,
    oceanNeuroticism: 40,
    scenarios: [
      {
        callId: 234589,
        service: 'Logistics',
        subject: 'Shipment Update',
        notes: 'User wants to know where their delivery currently is.',
        responses: {
          initial:
            'Hola {username}! Juan here. I can check your shipment. Do you happen to have the tracking number?',
          default:
            'No worries, if you tell me what item it was, I might be able to find it that way too.',
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi! I can check your shipment. Do you have the tracking number?',
            },
            {
              triggers: ['tracking', 'number', 'code', 'id'],
              response:
                'Awesome, thanks! Let me look it up. Do you know when it was last updated?',
            },
            {
              triggers: ['yesterday', 'today', 'two days', 'date', 'when'],
              response:
                "Cool. Looks like it's in transit. Would you like me to estimate the delivery date?",
            },
            {
              triggers: ['yes', 'please', 'sure', 'ok', 'okay'],
              response:
                'Alright, based on the route, it should arrive by the end of the week. Sound good?',
            },
            {
              triggers: ['good', 'fine', 'works', 'sounds good'],
              response:
                "Perfect! I'll send you a link to track it live if you want to keep an eye on it.",
            },
            {
              triggers: [
                'link',
                'track',
                'live',
                'eta',
                'delivery',
                'ups',
                'dhl',
                'fedex',
              ],
              response:
                "Here you go, just tap that link and you'll see real-time updates!",
            },
          ],
        },
      },
      {
        callId: 558901,
        service: 'Event Planning',
        subject: 'Meeting Coordination',
        notes: 'User needs help organizing a small team meeting.',
        responses: {
          initial:
            "Hey {username}, this is Juan. Let's get that meeting organized. How many people are joining?",
          default:
            "No problem, tell me roughly how many attendees, and I'll sort out the details.",
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                "Hey! Let's get that meeting organized. How many people are joining?",
            },
            {
              triggers: ['three', 'four', 'five', '3', '4', '5'],
              response:
                'Nice and manageable! Do you already have a preferred date or time?',
            },
            {
              triggers: [
                'tomorrow',
                'monday',
                'next week',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
              ],
              response:
                "Got it. I'll check the shared calendar. Would you prefer in-person or virtual?",
            },
            {
              triggers: ['virtual', 'zoom', 'online', 'meet', 'teams'],
              response:
                "Cool, I'll set it up. Do you want me to include a calendar invite link?",
            },
            {
              triggers: ['yes', 'invite', 'link', 'send'],
              response:
                "All set! You'll get an invite shortly. Anything else you'd like me to add to the agenda?",
            },
            {
              triggers: ['agenda', 'topic', 'notes', 'subject', 'items'],
              response:
                "Perfect, I'll include that. Everyone will get the updated meeting info soon!",
            },
          ],
        },
      },
      {
        callId: 777441,
        service: 'Information Request',
        subject: 'Policy Clarification',
        notes: 'User is asking for clarification about an update or procedure.',
        responses: {
          initial:
            'Hey {username}, Juan here. What part of the policy update are you unsure about?',
          default:
            'Gotcha, tell me what section or rule you want me to check for you.',
          rules: [
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hey! What part of the policy update are you unsure about?',
            },
            {
              triggers: ['update', 'change', 'new', 'revision', 'edit'],
              response:
                "Ah yes, that one! It's mainly about timing and requirements. Want me to summarize it?",
            },
            {
              triggers: ['summarize', 'explain', 'overview', 'details'],
              response:
                'Sure thing, the new version shortens the approval period to three days.',
            },
            {
              triggers: ['approval', 'period', 'days', 'deadline', 'window'],
              response:
                "Right, that's the key change. Would you like me to email you the full details?",
            },
            {
              triggers: ['email', 'send', 'document', 'pdf', 'file'],
              response: "Done! You'll have it in your inbox in a few minutes.",
            },
            {
              triggers: ['thanks', 'thank you', 'appreciate', 'thx'],
              response: 'Anytime! Glad I could help clear that up for you.',
            },
          ],
        },
      },
    ],
  },
];
