import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  if (!mockInterviewQuestion) return null; // Handle null or undefined gracefully

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const speech = new SpeechSynthesisUtterance(text);
        speech.onend = () => console.log("Speech ended");
        speech.onerror = (error) => {
          if (error.error === 'interrupted') {
            console.warn('Speech was interrupted. This is expected behavior when switching text.');
          } else {
            console.error('Speech error:', error);
          }
        };
        window.speechSynthesis.speak(speech);
      } catch (e) {
        console.error('An unexpected error occurred in textToSpeech:', e);
      }
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };


  const activeQuestion = mockInterviewQuestion?.[activeQuestionIndex];

  return (
    <div className="p-4 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.map((question, index) => {
          const isActive = activeQuestionIndex === index;
          return (
            <h2
              key={index} // Add unique key for each child
              className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${isActive ? 'bg-green-500 text-white' : 'bg-secondary'
                }`}
            >
              Question #{index + 1}
            </h2>
          );
        })}
      </div>
      <h2 className="my-5 text-lg md:text-md" aria-live="polite">
        {activeQuestion?.question || 'Select a question to view details'}
      </h2>
      <Volume2
        className="cursor-pointer"
        onClick={() => textToSpeech(activeQuestion?.question)}
        title="Listen to the question"
        aria-label="Listen to the question"
      />
      <div className="border rounded-lg p-5 bg-blue-200 text-blue-900 mt-20">
        <h2 className="flex gap-2 items-center">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="my=4 mt-3 text-sm text-blue-700">
          {process.env.NEXT_PUBLIC_INFORMATION || 'No additional information available.'}
        </h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
