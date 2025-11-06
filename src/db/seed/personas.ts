import { NewPersona } from '../drizzle/schema';

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
            'No worries, can you tell me roughly when the charge appeared or what card it was on?',
          rules: [
            {
              triggers: ['refund', 'charge', 'payment', 'amount', 'invoice'],
              response:
                'Got it! When did you notice the charge, or was it tied to a specific purchase?',
            },
            {
              triggers: ['yesterday', 'today', 'last week', 'date', 'when'],
              response:
                'That helps narrow it down. Did it show up on your card or online invoice?',
            },
            {
              triggers: ['card', 'invoice', 'statement', 'bank'],
              response:
                'Perfect. Once confirmed, should the refund go back to the same payment method?',
            },
            {
              triggers: ['same', 'different', 'account', 'method'],
              response:
                "Understood. I'll process it that way. It usually takes 3 to 5 business days. Does that work?",
            },
            {
              triggers: ['yes', 'ok', 'okay', 'fine', 'sure'],
              response:
                "Great! I'll submit your refund now. You'll get an email confirmation soon.",
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hey there! I can help with your refund. Which payment are you referring to?',
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
            'Hey {username}, this is John. I can help move your appointment. What date were you hoping for instead?',
          default:
            "No problem! Let's find a new time. When would work better for you, this week or next?",
          rules: [
            {
              triggers: ['reschedule', 'move', 'change'],
              response:
                'Sure thing! When was your original appointment supposed to happen?',
            },
            {
              triggers: ['original', 'old', 'before'],
              response:
                'Got it. Are you looking for an earlier date, or a bit later?',
            },
            {
              triggers: ['earlier', 'later', 'tomorrow', 'next week'],
              response:
                'Okay! Do you prefer mornings or afternoons for that new time?',
            },
            {
              triggers: ['morning', 'afternoon', 'evening'],
              response:
                'Perfect. Once updated, would you like text or email confirmation?',
            },
            {
              triggers: ['email', 'text', 'sms', 'message'],
              response:
                "Done! You'll get a confirmation shortly with the new details.",
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi! I can help move your appointment. What date were you hoping for instead?',
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
            "Sure thing! Could you tell me which part of the process you're curious about?",
          rules: [
            {
              triggers: ['policy', 'process', 'how', 'guide'],
              response:
                'I can explain that. Are you asking about the first step, or what happens afterward?',
            },
            {
              triggers: ['first', 'after', 'step', 'start'],
              response:
                'Right, the first step is usually verification. Do you have your reference ID handy?',
            },
            {
              triggers: ['id', 'reference', 'code', 'number'],
              response:
                'Thanks! That helps. Would you like me to summarize the whole procedure briefly?',
            },
            {
              triggers: ['summary', 'overview', 'details'],
              response:
                "It's a three-step process: verification, confirmation, and approval. Want me to break it down?",
            },
            {
              triggers: ['yes', 'ok', 'sure', 'please'],
              response: "Here's how it works step by step…",
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response: 'Hi! What information can I clarify for you today?',
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
        notes: 'User cannot log into their account.',
        responses: {
          initial:
            'Hello {username}, this is Jane from tech support. What happens when you try to log in?',
          default:
            "Let's figure it out together. Do you see any kind of error message?",
          rules: [
            {
              triggers: ['error', 'message', 'code'],
              response:
                'Good clue. What does the message say exactly, or can you paraphrase it?',
            },
            {
              triggers: ['password', 'forgot', 'reset'],
              response:
                'No problem. Have you tried resetting your password yet?',
            },
            {
              triggers: ['link', 'email', 'otp', 'verification'],
              response:
                "Okay, let's confirm your account is verified, that's often the missing step.",
            },
            {
              triggers: ['verified', 'status', '2fa', 'mfa'],
              response:
                'Perfect. Once verified, you should be able to log in. Want me to walk you through it?',
            },
            {
              triggers: ['yes', 'please', 'ok', 'sure'],
              response: "Great, I'll guide you step by step until it's fixed.",
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response: 'Hello! What happens when you try to log in?',
            },
          ],
        },
      },
      {
        callId: 784622,
        service: 'Setup Assistance',
        subject: 'Device Configuration',
        notes: 'User needs help connecting a new device.',
        responses: {
          initial:
            'Hi {username}, Jane here. I can help with setup. What device are you connecting?',
          default:
            "That's fine. Tell me the device make or model, and we'll go from there.",
          rules: [
            {
              triggers: ['phone', 'tablet', 'laptop', 'pc'],
              response:
                'Got it. Are you connecting via Wi-Fi, Bluetooth, or cable?',
            },
            {
              triggers: ['wifi', 'bluetooth', 'cable', 'usb'],
              response:
                "Let's make sure the device is powered on and in pairing mode, can you check that?",
            },
            {
              triggers: ['yes', 'checked', 'on', 'done'],
              response:
                'Great. Now look for your network name, do you see it listed?',
            },
            {
              triggers: ['found', 'see', 'listed', 'visible'],
              response:
                'Perfect. Select it and enter the passkey if prompted. Did it connect successfully?',
            },
            {
              triggers: ['connected', 'success', 'working'],
              response:
                "Excellent! Everything's configured properly, nice work.",
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi! I can help with the setup. What type of device are you connecting?',
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
            'Hi {username}, this is Jane. How long has your system been slow?',
          default:
            'Okay, is it slow on startup or when running specific programs?',
          rules: [
            {
              triggers: ['startup', 'boot', 'turn on'],
              response:
                'Could be startup processes. Want me to guide you through checking them?',
            },
            {
              triggers: ['program', 'app', 'software'],
              response: 'Which program seems to cause the slowdown the most?',
            },
            {
              triggers: ['browser', 'excel', 'video'],
              response:
                "Got it. Let's check background tasks. Do you see any using high CPU or memory?",
            },
            {
              triggers: ['cpu', 'memory', 'ram', 'high'],
              response:
                "That's likely the culprit. Ending or updating that should help!",
            },
            {
              triggers: ['yes', 'ok', 'sure'],
              response:
                'Good job! That usually fixes it. Anything else acting up?',
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                "Hi! I can help figure out what's slowing things down. How long has this been happening?",
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Lisa Peterson',
    role: 'Customer',
    tone: 'Anxious and reactive',
    oceanOpenness: 55,
    oceanConscientiousness: 40,
    oceanExtraversion: 60,
    oceanAgreeableness: 45,
    oceanNeuroticism: 90,
    scenarios: [
      {
        callId: 992001,
        service: 'Customer Support',
        subject: 'Order Not Arrived',
        notes: "Lisa's order is delayed and she's frustrated.",
        responses: {
          initial:
            "Hi... I've been waiting for my order forever. It's still not here! Can you please check?",
          default:
            "I just need to know when it's coming. Can you find that out?",
          rules: [
            {
              triggers: ['sorry', 'apologize', 'delay'],
              response:
                "Yeah, I've heard that before. I need an actual update, not another apology.",
            },
            {
              triggers: ['tracking', 'number', 'check'],
              response:
                'Okay. My tracking number is 88291. Please tell me where it is.',
            },
            {
              triggers: ['arrive', 'delivery', 'estimate'],
              response:
                'It was supposed to come two days ago. Is it lost or something?',
            },
            {
              triggers: ['refund', 'credit', 'compensation'],
              response:
                "Maybe a refund's better at this point. I'm tired of waiting.",
            },
            {
              triggers: ['thank', 'thanks', 'appreciate'],
              response:
                'Okay, I just hope it shows up this time. Thanks for checking.',
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                "Hi... yeah, I'm still waiting on my order. Can you help?",
            },
          ],
        },
      },
      {
        callId: 992002,
        service: 'Billing',
        subject: 'Double Charge',
        notes: 'Lisa believes she was charged twice.',
        responses: {
          initial:
            'Hey, I think I was charged twice for the same thing, can someone fix that?',
          default:
            "I see two payments for the same order, and it's stressing me out.",
          rules: [
            {
              triggers: ['refund', 'return', 'money', 'charge'],
              response:
                'Yes, exactly. I just want one of those charges reversed.',
            },
            {
              triggers: ['card', 'bank', 'statement'],
              response:
                "Yeah, it's right there on my bank statement, two identical amounts!",
            },
            {
              triggers: ['email', 'receipt', 'proof'],
              response:
                'Sure, I can send a screenshot if that helps. Where should I email it?',
            },
            {
              triggers: ['thank', 'thanks', 'appreciate'],
              response:
                'Okay, I really appreciate you helping me with this. I just hate money stuff.',
            },
            {
              triggers: ['hi', 'hello'],
              response:
                'Hi. Sorry if I sound upset. I just think I got charged twice.',
            },
          ],
        },
      },
      {
        callId: 992003,
        service: 'Product Inquiry',
        subject: 'Return Policy',
        notes: 'Lisa is nervous about returning a product.',
        responses: {
          initial:
            'Hey, can you tell me if I can return something? I think I bought the wrong size.',
          default: "I just don't want to mess this up and lose my money.",
          rules: [
            {
              triggers: ['return', 'refund', 'policy'],
              response:
                "So it's okay to return within 30 days, right? I just need to be sure.",
            },
            {
              triggers: ['label', 'ship', 'send back'],
              response:
                "Okay, I'll print the label and ship it. Do I get confirmation when you receive it?",
            },
            {
              triggers: ['email', 'notify', 'confirmation'],
              response:
                "Great. I'll watch for that email then. Thanks for helping. I get anxious with this stuff.",
            },
            {
              triggers: ['thanks', 'thank you', 'appreciate'],
              response:
                'Thanks for your patience. I just overthink these things.',
            },
            {
              triggers: ['hi', 'hello', 'hey'],
              response:
                'Hi. I need help with a return. I think I bought the wrong size.',
            },
          ],
        },
      },
    ],
  },
];
