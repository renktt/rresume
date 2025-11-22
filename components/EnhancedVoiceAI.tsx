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
  const processingRef = useRef(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log('Recognition result received');
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText + ' ';
          } else {
            interimTranscript += transcriptText;
          }
        }

        // Show real-time transcript (interim + final)
        const displayTranscript = (finalTranscript + interimTranscript).trim();
        setTranscript(displayTranscript);
        console.log('Transcript update:', displayTranscript, 'Has final:', !!finalTranscript.trim());

        // In continuous mode, collect all final results
        // Only process when we have substantial final text
        if (finalTranscript.trim().length > 0 && !processingRef.current) {
          console.log('Got final transcript, will process:', finalTranscript.trim());
          
          // Clear any existing timeout
          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
          }
          
          // Use a small delay to allow for continuation of speech
          // If user keeps talking, the timeout will be cleared
          processingTimeoutRef.current = setTimeout(() => {
            if (!processingRef.current && finalTranscript.trim()) {
              console.log('Processing final transcript:', finalTranscript.trim());
              processingRef.current = true;
              handleVoiceInput(finalTranscript.trim());
            }
          }, 800); // Wait 800ms after final result to see if user continues
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          toast.error('Microphone access denied. Please allow microphone access.');
          setIsListening(false);
          processingRef.current = false;
        } else if (event.error === 'audio-capture') {
          toast.error('No microphone detected. Please connect a microphone.');
          setIsListening(false);
          processingRef.current = false;
        } else if (event.error === 'no-speech') {
          console.log('No speech detected yet, continuing to listen...');
          // In continuous mode, this is normal - keep listening
        } else if (event.error === 'aborted') {
          console.log('Recognition stopped by user');
          processingRef.current = false;
        } else if (event.error === 'network') {
          console.log('Network error, will retry...');
          // Don't show error toast for transient network issues
        } else {
          console.error(`Unhandled recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended, isListening:', isListening);
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
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition on cleanup');
        }
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
    // Stop listening while processing
    stopListening();
    setIsProcessing(true);

    try {
      // Add user message to history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: transcriptText }
      ];

      // Get AI response using Groq
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcriptText,
          context: context || 'Voice conversation with digital twin',
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

    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Failed to process your message');
      const errorMsg = "I'm sorry, I'm having trouble processing that right now.";
      setResponse(errorMsg);
      await speak(errorMsg);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
      
      // In continuous mode, recognition should still be running
      // Only restart if it somehow stopped
      setTimeout(() => {
        if (!isListening && !isSpeaking) {
          console.log('Recognition stopped unexpectedly, restarting...');
          startListening();
        }
      }, 1500);
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

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping recognition');
      }
    }
    setIsListening(false);
  };

  const startListening = async () => {
    if (!isSupported) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      console.log('Already listening, skipping start');
      return;
    }

    try {
      // Stop any existing recognition first
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (e) {
          // Ignore if already stopped
        }
      }

      // Request microphone permission first
      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      
      // Stop the stream immediately (we just needed permission)
      stream.getTracks().forEach(track => track.stop());
      
      setTranscript('');
      setResponse('');
      processingRef.current = false;
      
      // Start recognition
      console.log('Starting speech recognition...');
      recognitionRef.current?.start();
      setIsListening(true);
      updateAudioLevel();
      console.log('Voice recognition started in continuous mode');
    } catch (error: any) {
      console.error('Error starting recognition:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone access in your browser.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone.');
      } else if (error.message?.includes('already started')) {
        console.log('Recognition already running, setting state');
        setIsListening(true);
      } else {
        toast.error('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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
