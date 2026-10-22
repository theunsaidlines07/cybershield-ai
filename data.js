// All content in this file is fictional and for educational use only.
// Links are written with fake/reserved domains and are never opened by the app.

export const SAMPLES = [
  {
    label: 'Fake bank KYC alert',
    icon: 'landmark',
    text: 'Dear Customer, your SecureTrust Bank account will be BLOCKED within 24 hours due to incomplete KYC. Update immediately at http://securetrust-kyc-update.xyz/login and share the OTP sent to your mobile to verify. Ignore this and your account will be permanently suspended.'
  },
  {
    label: 'Prize / lottery claim',
    icon: 'gift',
    text: 'Congratulations!! Your number has WON Rs 25,00,000 in the National Lucky Draw 2024. To claim your prize, pay a processing fee of Rs 4,999 via UPI to luckydraw.claims@fakeupi within 2 hours. Hurry, offer expires today!'
  },
  {
    label: 'Fake job offer',
    icon: 'briefcase',
    text: 'Hello! We found your profile online. Earn Rs 8,000/day working from home, just liking videos. No experience needed. Pay a one-time registration fee of Rs 1,500 to start. Contact our HR on WhatsApp now, limited seats!'
  },
  {
    label: 'Delivery notification',
    icon: 'package',
    text: 'SwiftPost: Your parcel could not be delivered due to an unpaid address fee of Rs 25. Please pay now to avoid return: bit.ly/sp-redeliver-x7. Download the attached Delivery_Form.apk to reschedule.'
  },
  {
    label: 'Remote-access support',
    icon: 'headset',
    text: 'This is technical support from your bank. We detected suspicious activity on your account. Please install AnyDesk and share the 9-digit code with our executive so we can secure your account and process your refund.'
  },
  {
    label: 'Normal message',
    icon: 'message-circle',
    text: 'Hi! Just a reminder that the science exhibition practice is tomorrow at 10 AM in the school lab. Please bring your project chart and extension cord. See you there!'
  }
];

export const DEMO_MESSAGE = SAMPLES[0].text;

export const LESSONS = [
  {
    id: 'phishing',
    title: 'Phishing messages & emails',
    icon: 'mail-warning',
    color: 'cyan',
    definition: 'Messages that pretend to be from a trusted source to trick you into clicking a link, opening a file, or revealing personal details.',
    example: '“Your email storage is full. Click here within 12 hours to keep your account active.”',
    signs: ['Generic greetings like “Dear user”', 'Urgent deadlines or threats', 'Links that do not match the official website', 'Spelling mistakes or odd formatting'],
    prevention: ['Do not click links in unexpected messages', 'Open the official app or type the website address yourself', 'Check the sender address carefully', 'Report phishing using the email app’s report option']
  },
  {
    id: 'bank-gov',
    title: 'Fake bank or government alerts',
    icon: 'landmark',
    color: 'blue',
    definition: 'Scammers pose as a bank, tax office, police, or other authority to scare you into acting quickly.',
    example: '“Your bank account will be frozen today. Update your KYC using this link and share the OTP.”',
    signs: ['Threats of account blocking, fines, or arrest', 'Requests for OTP, PIN, CVV, or passwords', 'KYC update links sent through SMS or WhatsApp', 'Pressure to stay on the call and not tell anyone'],
    prevention: ['Banks and authorities do not ask for your OTP or PIN', 'Call the number printed on your card or official website', 'Visit the branch or official app to check', 'Hang up on threatening callers']
  },
  {
    id: 'upi-qr',
    title: 'UPI & QR-code payment scams',
    icon: 'qr-code',
    color: 'green',
    definition: 'Tricks that make you send money when you think you are receiving it, often using collect requests or QR codes.',
    example: '“I’m sending payment for your item. Scan this QR code and enter your UPI PIN to receive the money.”',
    signs: ['Being asked to enter your PIN to “receive” money', 'Unexpected collect requests', 'Buyers who “accidentally” send extra and ask for a refund', 'QR codes shared by strangers'],
    prevention: ['You never need a UPI PIN to receive money', 'Read every payment screen before approving', 'Decline collect requests you don’t recognise', 'Check the payee name before paying']
  },
  {
    id: 'jobs',
    title: 'Fake job offers & advance-fee fraud',
    icon: 'briefcase',
    color: 'amber',
    definition: 'Offers of easy jobs, loans, or rewards that require you to pay a “fee” first, after which the scammer disappears.',
    example: '“Earn ₹5,000 daily by liking videos. Pay ₹999 registration to start today.”',
    signs: ['Very high pay for very little work', 'Fees for registration, training, or a kit', 'Recruitment only through WhatsApp or Telegram', 'No interview or proper company details'],
    prevention: ['Real employers do not charge you to get a job', 'Research the company on its official website', 'Be careful of “tasks” that need deposits', 'Talk to a parent, teacher, or trusted adult first']
  },
  {
    id: 'shopping',
    title: 'Online shopping & delivery scams',
    icon: 'package',
    color: 'cyan',
    definition: 'Fake stores, fake sellers, or fake delivery messages that collect payment or personal data without delivering anything.',
    example: '“Your parcel is on hold. Pay ₹25 redelivery fee at this link.”',
    signs: ['Prices that are far too low', 'Small “redelivery” or “customs” fees through links', 'Shops with no reviews, contact, or return policy', 'Only advance payment accepted'],
    prevention: ['Track parcels only in the official courier or shop app', 'Prefer trusted platforms and cash-on-delivery when unsure', 'Search for reviews of unknown stores', 'Never pay fees through SMS links']
  },
  {
    id: 'support',
    title: 'Impersonation & fake customer support',
    icon: 'headset',
    color: 'blue',
    definition: 'Scammers pretend to be customer care, a relative, or a friend, sometimes asking you to install apps that let them control your phone.',
    example: '“I’m from customer support. Install this screen-sharing app so I can process your refund.”',
    signs: ['Requests to install remote-access or screen-sharing apps', 'Support numbers found in random search results or comments', 'A “friend” on a new number asking for urgent money', 'Asking you to keep it secret'],
    prevention: ['Get support contacts only from official websites or apps', 'Never install apps because a caller asks', 'Call the friend or relative on their known number', 'End the call if you feel pressured']
  },
  {
    id: 'investment',
    title: 'Investment & unrealistic-profit scams',
    icon: 'trending-up',
    color: 'amber',
    definition: 'Promises of guaranteed, very high returns from trading, crypto, or “schemes” that are designed to take your money.',
    example: '“Double your money in 7 days. Guaranteed profit. Join our VIP trading group.”',
    signs: ['“Guaranteed” or extremely high returns', 'Pressure to invest more to “unlock” withdrawals', 'Screenshots of other people’s profits', 'Unregistered apps or websites'],
    prevention: ['No real investment guarantees high profits', 'Check if the platform is registered with the regulator', 'Be suspicious if you cannot withdraw money', 'Discuss investments with a trusted adult']
  },
  {
    id: 'links',
    title: 'Malicious links & fake login pages',
    icon: 'link-2-off',
    color: 'green',
    definition: 'Look-alike websites built to copy real login pages and steal your username, password, or card details.',
    example: 'A link like “secure-login-yourbank.top” that looks like your bank’s page.',
    signs: ['Misspelled or extra words in the domain', 'Shortened links that hide the real address', 'Unusual endings like .xyz, .top, or .click', 'Login pages opened from a message link'],
    prevention: ['Type the address yourself or use the official app', 'Use a password manager — it won’t autofill on fake sites', 'Look at the full domain before entering anything', 'Never download files or APKs from messages']
  },
  {
    id: 'otp',
    title: 'OTP, PIN & account security',
    icon: 'key-round',
    color: 'cyan',
    definition: 'Your OTP, PIN, and passwords are the keys to your accounts. Anyone who has them can act as you.',
    example: '“I sent an OTP to your phone by mistake. Please tell me the code.”',
    signs: ['Anyone asking you to read out an OTP', 'Messages asking you to “verify” your password', 'Login alerts you did not request', 'Codes arriving that you did not ask for'],
    prevention: ['Never share OTP, PIN, CVV, or passwords', 'Turn on two-factor authentication', 'Use different, strong passwords for each account', 'Change passwords from a trusted device if you suspect a leak']
  }
];

export const RULES = [
  { icon: 'key-round', text: 'Never share an OTP, UPI PIN, or password with another person.' },
  { icon: 'phone-call', text: 'Verify unexpected requests using an independently obtained official contact.' },
  { icon: 'timer-off', text: 'Do not rush into payments because of threats or pressure.' },
  { icon: 'link-2-off', text: 'Avoid unknown links, attachments, and app installations.' },
  { icon: 'shield-check', text: 'Enable two-factor authentication where available.' },
  { icon: 'landmark', text: 'Contact your bank promptly if you suspect unauthorized transactions.' }
];

// answer: 'suspicious' | 'legit' | 'unsure'
export const QUIZ = [
  {
    channel: 'SMS', from: 'VK-SWFTPS', icon: 'package',
    message: 'SwiftPost: Your parcel is on hold due to incomplete address. Pay Rs 19 fee within 12 hrs to avoid return: swiftpost-redeliver.top/pay',
    answer: 'suspicious',
    explanation: 'Courier companies don’t usually ask for small fees through SMS links. The odd web address and short deadline are classic signs of a delivery scam.',
    signs: ['Small fee requested through a link', 'Unusual domain ending (.top)', 'Pressure: “within 12 hrs”']
  },
  {
    channel: 'SMS', from: 'AX-STRBNK', icon: 'landmark',
    message: 'Rs 450.00 debited from A/c XX4821 on 12-Mar for UPI txn to CITY CAFE. Not you? Call the number on the back of your card. -StarBank',
    answer: 'legit',
    explanation: 'This looks like a normal transaction alert. It contains no link, asks for no OTP or PIN, and tells you to use the number on your own card — an independently obtained contact.',
    signs: ['No link or attachment', 'No request for secret codes', 'Points you to an official contact you already have']
  },
  {
    channel: 'WhatsApp', from: '+00 00000 00000', icon: 'briefcase',
    message: 'Hi! I am Priya from GlobalHire. Part-time job: earn ₹6,000/day by rating hotels online. Pay ₹2,000 security deposit to activate your account. Reply YES fast, only 5 seats left!',
    answer: 'suspicious',
    explanation: 'Real jobs don’t ask you to pay a deposit to start. Unrealistic pay and “only 5 seats left” are designed to make you act without thinking.',
    signs: ['Advance fee / deposit', 'Unrealistically high pay', 'Artificial scarcity and urgency']
  },
  {
    channel: 'Email', from: 'no-reply@accounts.example', icon: 'user-round-check',
    message: 'A new sign-in to your account was detected on a Windows device. If this was you, no action is needed. If not, open the app and go to Settings > Security to review activity.',
    answer: 'legit',
    explanation: 'This is how many genuine security alerts look: informative, no threats, no link to click, and it tells you to use the official app yourself. Still, always check inside the real app rather than through any link.',
    signs: ['No link required', 'Tells you to use the official app', 'No request for passwords or payment']
  },
  {
    channel: 'Call transcript', from: 'Unknown caller', icon: 'headset',
    message: '“Ma’am, I’m calling from your bank’s fraud department. Someone tried to use your card. To block it, please read out the OTP you just received.”',
    answer: 'suspicious',
    explanation: 'No genuine bank employee will ever ask you to read out an OTP. The OTP is exactly what the caller needs to complete a payment from your account.',
    signs: ['Request for OTP', 'Fear tactic: “someone used your card”', 'Unverified caller claiming to be a bank']
  },
  {
    channel: 'Instagram DM', from: '@lucky_giveaway_official2', icon: 'gift',
    message: 'Congratulations 🎉 You are selected as the winner of our iPhone giveaway! Just pay ₹499 shipping charges via UPI to claim. Offer valid for 1 hour only.',
    answer: 'suspicious',
    explanation: 'You can’t win a contest you didn’t enter, and genuine prizes don’t require you to pay first. The account name with “official2” is also a hint of impersonation.',
    signs: ['Unexpected prize', 'Payment needed to claim', 'Short deadline', 'Look-alike account name']
  },
  {
    channel: 'SMS', from: '+00 00000 11111', icon: 'message-circle',
    message: 'Hi, this is Aman from the cricket club. Is this still your number?',
    answer: 'unsure',
    explanation: 'There are no warning signs yet — but there isn’t enough information to trust it either. It could be genuine, or the start of a conversation that later asks for money. Don’t share personal details until you verify who it is.',
    signs: ['Unknown number', 'No request yet — watch what follows', 'Verify through a known contact or in person']
  },
  {
    channel: 'Email', from: 'support@paypa1-security.example', icon: 'mail-warning',
    message: 'Your account has been limited. Download the attached Account_Verify.html and enter your password and card details to restore access.',
    answer: 'suspicious',
    explanation: 'The sender domain uses “paypa1” with the number 1 instead of the letter L — a look-alike trick. Attachments that ask for passwords and card details are a strong phishing sign.',
    signs: ['Look-alike domain (paypa1)', 'Unexpected attachment', 'Request for password and card details']
  },
  {
    channel: 'In-app notification', from: 'School Portal', icon: 'school',
    message: 'Your Term 2 report card is now available. Log in to the school portal app to view it.',
    answer: 'legit',
    explanation: 'An informational notice inside an app you already use, with no link, no payment, and no secret codes requested, is probably legitimate.',
    signs: ['Delivered inside a trusted app', 'No link, payment, or code requested']
  },
  {
    channel: 'WhatsApp', from: '+00 00000 22222', icon: 'user-round-x',
    message: 'Hi Mom, I dropped my phone and this is my new number. I need ₹8,000 urgently for a repair, please send to this UPI ID. Don’t call, the mic is broken.',
    answer: 'suspicious',
    explanation: 'This is a common family-impersonation scam. A new number, urgent money request, and “don’t call” are red flags. Always call the family member on their old, known number.',
    signs: ['New unknown number', 'Urgent money request', 'Avoids voice verification']
  }
];
