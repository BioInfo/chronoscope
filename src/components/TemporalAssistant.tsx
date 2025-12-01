import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trash2,
  Bot,
  User,
} from 'lucide-react';
import { useChronoscope } from '../context/ChronoscopeContext';
import { sendChatMessage, getSuggestedQuestions } from '../services/chatService';
import { isGeminiConfigured } from '../services/geminiService';
import { renderMessageWithLinks } from '../utils/markdownLinks';
import type { ChatMessage } from '../types';

export function TemporalAssistant() {
  const { state } = useChronoscope();
  const { currentScene } = state;

  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggested questions when scene changes
  useEffect(() => {
    if (currentScene) {
      setSuggestedQuestions(getSuggestedQuestions(currentScene));
      // Clear chat history when scene changes significantly
      setMessages([]);
      setError(null);
    }
  }, [currentScene?.coordinates.spatial.latitude, currentScene?.coordinates.spatial.longitude, currentScene?.coordinates.temporal.year]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentScene || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      const result = await sendChatMessage(
        message.trim(),
        currentScene,
        messages
      );

      if (result.success && result.response) {
        const assistantMessage: ChatMessage = {
          role: 'model',
          content: result.response,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(result.error || 'Failed to get response');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const isApiConfigured = isGeminiConfigured();

  // Show collapsed state
  if (!isExpanded) {
    return (
      <div className="panel-chrono p-3">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between text-chrono-text-dim hover:text-chrono-blue transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">Temporal Assistant</span>
            {messages.length > 0 && (
              <span className="px-1.5 py-0.5 bg-chrono-blue/20 text-chrono-blue rounded text-xs font-mono">
                {messages.length}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // No scene loaded state
  if (!currentScene) {
    return (
      <div className="panel-chrono p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-chrono-text-dim">
            <MessageSquare className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">Temporal Assistant</span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-chrono-text-dim hover:text-chrono-blue transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Bot className="w-8 h-8 text-chrono-text-dim mb-3" />
          <p className="font-mono text-sm text-chrono-text-dim">
            No active scene
          </p>
          <p className="font-mono text-xs text-chrono-text-dim/50 mt-1">
            Render a scene to start chatting
          </p>
        </div>
      </div>
    );
  }

  // API not configured state
  if (!isApiConfigured) {
    return (
      <div className="panel-chrono p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-chrono-text-dim">
            <MessageSquare className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">Temporal Assistant</span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-chrono-text-dim hover:text-chrono-blue transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="w-8 h-8 text-chrono-yellow mb-3" />
          <p className="font-mono text-sm text-chrono-yellow">
            API key required
          </p>
          <p className="font-mono text-xs text-chrono-text-dim/50 mt-1">
            Configure your Gemini API key in Settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-chrono p-4 flex flex-col gap-3" style={{ height: 'calc(100vh - 450px)', minHeight: '300px' }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-chrono-purple">
          <MessageSquare className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Temporal Assistant</span>
          <Sparkles className="w-3 h-3 text-chrono-purple/60" />
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-chrono-text-dim hover:text-chrono-red transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(false)}
            className="text-chrono-text-dim hover:text-chrono-blue transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="font-mono text-xs text-chrono-text-dim text-center py-2">
              Ask me anything about this moment in history
            </p>

            {/* Suggested Questions */}
            <div className="space-y-2">
              <span className="font-mono text-xs text-chrono-text-dim uppercase">
                Suggested:
              </span>
              <div className="space-y-1">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left px-3 py-2 bg-chrono-dark/50 hover:bg-chrono-dark rounded text-xs font-mono text-chrono-text-dim hover:text-chrono-blue transition-colors border border-chrono-border/50 hover:border-chrono-blue/50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chrono-purple/20 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-chrono-purple" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-xs font-mono ${
                    msg.role === 'user'
                      ? 'bg-chrono-blue/20 text-chrono-blue border border-chrono-blue/30'
                      : 'bg-chrono-dark text-chrono-text border border-chrono-border/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap">
                    {msg.role === 'model' ? renderMessageWithLinks(msg.content) : msg.content}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chrono-blue/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-chrono-blue" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chrono-purple/20 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-chrono-purple" />
                </div>
                <div className="px-3 py-2 rounded-lg bg-chrono-dark border border-chrono-border/50">
                  <Loader2 className="w-4 h-4 text-chrono-purple animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-chrono-red/10 border border-chrono-red/30 rounded text-xs flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-chrono-red flex-shrink-0" />
          <span className="font-mono text-chrono-red">{error}</span>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about this moment..."
          disabled={isLoading}
          maxLength={500}
          className="flex-1 bg-chrono-dark border border-chrono-border rounded px-3 py-2 text-xs font-mono text-chrono-text placeholder:text-chrono-text-dim/50 focus:outline-none focus:border-chrono-purple disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="px-3 py-2 bg-chrono-purple/20 hover:bg-chrono-purple/30 border border-chrono-purple/50 rounded text-chrono-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Character Count */}
      {inputValue.length > 400 && (
        <div className="text-right text-xs font-mono text-chrono-text-dim flex-shrink-0">
          {inputValue.length}/500
        </div>
      )}
    </div>
  );
}
