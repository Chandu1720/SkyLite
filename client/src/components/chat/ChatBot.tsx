import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; link?: string }[];
}

const FAQ_DATABASE: { keywords: string[]; answer: string; actions?: { label: string; action: string; link?: string }[] }[] = [
  {
    keywords: ['price', 'cost', 'rate', 'pricing', 'how much', 'charge', 'package'],
    answer: 'SkyLite offers 4 tailored celebration packages:\n• **Basic Experience** (₹1,999) — 2 hrs private screening & welcome drinks\n• **Birthday Premium** (₹2,999) — 2 hrs with customized balloon decor & cake\n• **Anniversary Premium** (₹3,499) — 2 hrs romantic floral decor & candlelit feel\n• **Luxury Celebration** (₹4,499) — 3 hrs complete celebration with photography & snacks',
    actions: [
      { label: 'View All Packages', action: 'link', link: '/packages' },
      { label: 'Book Now', action: 'link', link: '/book' }
    ]
  },
  {
    keywords: ['birthday', 'anniversary', 'proposal', 'date', 'occasion', 'celebrate', 'events'],
    answer: 'We host private celebrations for Birthdays, Anniversaries, Romantic Date Nights, Movie Screenings, Proposals, and Family/Friends Gatherings! We provide personalized screen messages, ambient lighting, and balloon/flower setups.',
    actions: [
      { label: 'Explore Occasions', action: 'link', link: '/occasions' },
      { label: 'Book Celebration', action: 'link', link: '/book' }
    ]
  },
  {
    keywords: ['pay', 'payment', 'upi', 'gpay', 'phonepe', 'qr', 'advance'],
    answer: 'Booking is 100% online and seamless! When you select your slot, we generate a dynamic UPI QR code & UPI deep-link (GPay, PhonePe, Paytm). Once payment is submitted, our team verifies and confirms your slot instantly.',
    actions: [
      { label: 'Check Booking Status', action: 'link', link: '/booking/status' }
    ]
  },
  {
    keywords: ['slot', 'time', 'timing', 'duration', 'open', 'close', 'hours'],
    answer: 'We operate daily from 10:00 AM to 10:00 PM with 5 prime slots:\n• 10:00 AM – 12:00 PM\n• 12:30 PM – 02:30 PM\n• 03:00 PM – 05:00 PM\n• 05:30 PM – 07:30 PM\n• 08:00 PM – 10:00 PM\nYou can also add extra hours during booking.',
    actions: [
      { label: 'Check Available Slots', action: 'link', link: '/book' }
    ]
  },
  {
    keywords: ['location', 'address', 'where', 'map', 'directions'],
    answer: 'SkyLite Private Theatre is located in the heart of the city with dedicated valet parking, air-conditioned lounge, and private washrooms.',
    actions: [
      { label: 'View Contact & Map', action: 'link', link: '/contact' }
    ]
  },
  {
    keywords: ['food', 'cake', 'snacks', 'eat', 'beverage', 'drink', 'addons'],
    answer: 'Yes! We offer add-ons including custom designer cakes (Chocolate/Red Velvet), Rose bouquets, Balloon decoration, Professional photography, and gourmet snacks.',
    actions: [
      { label: 'Customize in Booking', action: 'link', link: '/book' }
    ]
  },
  {
    keywords: ['cancel', 'refund', 'reschedule', 'change date'],
    answer: 'You can reschedule your slot up to 24 hours prior to your showtime directly by contacting our concierge on WhatsApp.',
    actions: [
      { label: 'Read Policies', action: 'link', link: '/cancellation-policy' }
    ]
  }
];

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! Welcome to **SkyLite Private Theatre** 🎬✨\nHow can I help plan your private cinema celebration today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: '🍿 Packages & Pricing', action: 'query' },
        { label: '🎂 Occasions & Decor', action: 'query' },
        { label: '📅 Slots & Timings', action: 'query' },
        { label: '💳 Payment Info', action: 'query' },
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      const matchedFaq = FAQ_DATABASE.find((item) =>
        item.keywords.some((k) => lower.includes(k))
      );

      let botResponse: Message;

      if (matchedFaq) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: matchedFaq.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: matchedFaq.actions,
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "I'd love to assist you with that! Would you like to check our celebration packages or speak directly with our concierge team?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: [
            { label: 'View Packages', action: 'link', link: '/packages' },
            { label: 'Book Now', action: 'link', link: '/book' },
            { label: 'Chat on WhatsApp', action: 'whatsapp' },
          ]
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (actionObj: { label: string; action: string; link?: string }) => {
    if (actionObj.action === 'whatsapp') {
      window.open('https://wa.me/918008292789?text=Hi%20SkyLite,%20I%20have%20a%20query%20regarding%20booking%20a%20private%20theatre.', '_blank');
    } else if (actionObj.action === 'query') {
      handleSend(actionObj.label);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2.5 bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-dark font-bold px-4 py-3 rounded-full shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all hover:scale-105 active:scale-95"
              aria-label="Open chat assistant"
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-brand-dark" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <span className="text-xs tracking-wide uppercase font-body font-bold pr-1">Ask SkyLite</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chatbot Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-brand-dark border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            >
              {/* Header */}
              <div className="bg-brand-darker border-b border-gray-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-bold text-white flex items-center gap-1.5">
                      SkyLite Concierge
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    </h3>
                    <p className="text-[11px] text-gray-400">Instant celebration assistance</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-brand-dark/50 font-body">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-brand-gold text-brand-dark font-medium rounded-br-xs'
                          : 'bg-brand-darker border border-gray-800 text-gray-200 rounded-bl-xs shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>

                    <span className="text-[10px] text-gray-500 mt-1 px-1">{m.timestamp}</span>

                    {/* Quick action suggestions */}
                    {m.quickActions && m.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {m.quickActions.map((action, idx) => (
                          action.action === 'link' && action.link ? (
                            <Link
                              key={idx}
                              to={action.link}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold px-2.5 py-1 rounded-full transition-colors"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          ) : (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action)}
                              className="inline-flex items-center gap-1 text-[11px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded-full transition-colors"
                            >
                              <span>{action.label}</span>
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1 bg-brand-darker border border-gray-800 rounded-2xl px-3 py-2 w-14">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-brand-darker border-t border-gray-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about packages, decor, slots..."
                  className="flex-1 bg-brand-dark border border-gray-800 rounded-full px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-gold"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-500 transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
