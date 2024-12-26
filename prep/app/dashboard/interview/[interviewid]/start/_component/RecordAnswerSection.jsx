"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'


function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults

  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false
  });

  useEffect(() => {
    results?.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);


  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      SaveUserAnswer();
    }
    if (isRecording && userAnswer?.length < 10) {
      setLoading(false);
      toast('Error while saving your answer.Please try again!');
      return;
    }
  }, [userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {

      stopSpeechToText();

    }
    else {
      startSpeechToText();
    }
  }

  const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0 || !error.message.includes('503')) throw error;
      console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2); // Exponential backoff
    }
  };
  let JsonFeedbackResp;
  const SaveUserAnswer = async () => {

    setLoading(true)
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer:" + userAnswer + ",Depends on question and user answer for give interview question " +
      " please give us rating for answer and feedback as area of improvmenet if any " +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
    console.log("Feedback Prompt:", feedbackPrompt);
    try {
      await retryWithBackoff(async () => {
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = result.response
          .text()
          .replace('```json', '')
          .replace('```', '');
        JsonFeedbackResp = JSON.parse(mockJsonResp);
        console.log(JsonFeedbackResp);

      });
    } catch (error) {
      console.error("Failed after retries:", error);
    }

    const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      })

    if (resp) {
      toast('User Answer recorded successfully');
      setUserAnswer('');
      setResults([]);
    }
    setResults([]);

    setLoading(false);


  };


  return (
    <div className='flex items-center justify-center flex-col'>
      <div style={{ height: 300, width: 500 }} className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image
          src={'/webcam.png'}
          width={200}
          height={200}
          alt="Webcam placeholder image"
          className='absolute'
        />

        <Webcam
          mirrored={true}
          style={{
            height: 500,
            width: 500,
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading || isRecording}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
            <StopCircle />Stop Recording
          </h2>
        ) : (
          <h2 className='text-primary flex gap-2 items-center'>
            <Mic /> Record Answer
          </h2>
        )}
      </Button>



    </div>
  )
}

export default RecordAnswerSection