'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceAIProps {
  greeting?: string;
  context?: string;
  autoGreet?: boolean;
  buttonText?: string;
  className?: string;
}

export default function VoiceAI({
  greeting = "Hello! I'm Renante's digital twin. How can I assist you today?",
  context = '',
  autoGreet = false,
  buttonText = 'Talk to My Twin',
  className = '',
}: VoiceAIProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          handleVoiceInput(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Auto-greet on mount if enabled
    if (autoGreet) {
      setTimeout(() => speak(greeting), 500);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setResponse(text);
    }
  };

  const handleVoiceInput = async (input: string) => {
    try {
      // Call OpenAI API to get response
      const res = await fetch('/api/voice-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, context }),
      });

      const data = await res.json();
      if (data.response) {
        speak(data.response);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      speak("I'm sorry, I encountered an error. Please try again.");
    }
  };

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className={`voice-ai-container ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Voice AI Button */}
        <button
          onClick={toggleListening}
          disabled={isSpeaking}
          className={`flex items-center space-x-2 px-6 py-3 rounded-custom font-medium transition-custom ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'btn-primary'
          } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <>
              <MicOff size={20} />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <Mic size={20} />
              <span>{buttonText}</span>
            </>
          )}
        </button>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center space-x-2 px-4 py-2 bg-accent dark:bg-dark-secondary rounded-lg hover:bg-secondary dark:hover:bg-dark-accent transition-custom"
          >
            <VolumeX size={20} className="text-highlight dark:text-dark-highlight" />
            <span className="text-sm">Stop Speaking</span>
          </button>
        )}

        {/* Waveform Animation */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center justify-center space-x-1 h-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-highlight dark:bg-dark-highlight rounded-full wave-bar"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="w-full max-w-md p-4 bg-accent dark:bg-dark-secondary rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <strong>You:</strong> {transcript}
            </p>
          </div>
        )}

        {/* Response Display */}
        {response && !isSpeaking && (
          <div className="w-full max-w-md p-4 bg-highlight/10 dark:bg-dark-highlight/10 rounded-lg border border-highlight dark:border-dark-highlight">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <strong>Twin:</strong> {response}
            </p>
          </div>
        )}

        {!isSupported && (
          <p className="text-sm text-red-500">
            Speech recognition is not supported in your browser.
          </p>
        )}
      </div>
    </div>
  );
}
