'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContextualPrompt } from '@/lib/digital-twin-personality';
import toast from 'react-hot-toast';

interface EnhancedVoiceAIProps {
  greeting?: string;
  context?: string;
  autoGreet?: boolean;
  buttonText?: string;
  className?: string;
  sessionId?: string;
}

export default function EnhancedVoiceAI({
  greeting = "Hello! I'm Renante's digital twin. How can I assist you today?",
  context = '',
  autoGreet = false,
  buttonText = 'Talk to My Twin',
  className = '',
  sessionId = 'voice_session',
}: EnhancedVoiceAIProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        console.error('Speech recognition not supported');
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
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;

      // Auto-greet on mount
      if (autoGreet) {
        setTimeout(() => speak(greeting), 1000);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoGreet, greeting]);

  // Audio level visualization
  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255);

    if (isListening || isSpeaking) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const handleVoiceInput = async (transcriptText: string) => {
    setIsListening(false);
    setIsProcessing(true);
    setTranscript(transcriptText);

    try {
      // Add user message to history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: transcriptText }
      ];

      // Store in shared memory
      try {
        await fetch('/api/ai/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            role: 'user',
            content: transcriptText,
          }),
        });
      } catch (e) {
        console.log('Memory storage skipped');
      }

      // Get AI response
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcriptText,
          context: context || 'Voice conversation',
          sessionId,
          conversationHistory: updatedHistory,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      const aiResponse = data.response;

      setResponse(aiResponse);
      
      // Update conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: aiResponse }
      ]);

      // Speak the response
      await speak(aiResponse);

      // Store assistant response in memory
      try {
        await fetch('/api/ai/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            conversationType: 'voice',
            message: transcriptText,
            response: aiResponse,
            context,
          }),
        });
      } catch (e) {
        console.log('Memory storage skipped');
      }

    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Failed to process your message');
      const errorMsg = "I'm sorry, I'm having trouble processing that right now.";
      setResponse(errorMsg);
      await speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthRef.current) {
        resolve();
        return;
      }

      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        updateAudioLevel();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
        resolve();
      };

      synthRef.current.speak(utterance);
    });
  };

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setTranscript('');
        setResponse('');
        updateAudioLevel();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          Voice features are not supported in your browser. Please try Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Waveform Visualizer */}
      <AnimatePresence>
        {(isListening || isSpeaking || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center space-x-2 h-24"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-highlight dark:bg-dark-highlight rounded-full"
                animate={{
                  height: isProcessing 
                    ? [20, 60, 20]
                    : [20, 20 + (audioLevel * 40) * (1 + i * 0.2), 20],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={toggleListening}
          disabled={isSpeaking || isProcessing}
          className={`relative p-6 rounded-full transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-highlight dark:bg-dark-highlight hover:opacity-90'
          } text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isProcessing ? (
            <Loader2 size={32} className="animate-spin" />
          ) : isListening ? (
            <>
              <MicOff size={32} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </>
          ) : (
            <Mic size={32} />
          )}
        </button>

        {isSpeaking && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={stopSpeaking}
            className="ml-4 p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg transition-colors"
            aria-label="Stop speaking"
          >
            <VolumeX size={24} />
          </motion.button>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        {isProcessing ? (
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">
            Processing your message...
          </p>
        ) : isListening ? (
          <p className="text-highlight dark:text-dark-highlight font-semibold animate-pulse">
            🎤 Listening... Speak now
          </p>
        ) : isSpeaking ? (
          <p className="text-highlight dark:text-dark-highlight font-semibold">
            🔊 Speaking...
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            {buttonText}
          </p>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent dark:bg-dark-secondary p-4 rounded-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">You said:</p>
          <p className="text-gray-800 dark:text-gray-200">{transcript}</p>
        </motion.div>
      )}

      {/* Response Display */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-highlight/10 dark:bg-dark-highlight/10 p-4 rounded-lg border border-highlight/20 dark:border-dark-highlight/20"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
            <Activity size={16} className="mr-2" />
            Renante's Twin:
          </p>
          <p className="text-gray-800 dark:text-gray-200">{response}</p>
        </motion.div>
      )}

      {/* Conversation History Summary */}
      {conversationHistory.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {conversationHistory.length} message{conversationHistory.length !== 1 ? 's' : ''} in this conversation
          </p>
        </div>
      )}
    </div>
  );
}
