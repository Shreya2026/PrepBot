"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

try {
    const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, "expected_mockId")); // Replace with your mockId
    console.log("Filtered data:", result);
} catch (error) {
    console.error("Error fetching data:", error);
}



function Interview({ params }) {

    const [interviewData, setInterviewData] = useState();
    const [interviewid, setInterviewId] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    useEffect(() => {
        const resolveParams = async () => {
            try {
                const resolvedParams = await params; // Await the promise
                console.log(resolvedParams.interviewid);
                setInterviewId(resolvedParams.interviewid); // Store the resolved interview ID
                GetInterviewDetails(resolvedParams.interviewid); // Call the function with the resolved ID
            } catch (error) {
                console.error("Failed to resolve params:", error);
            }
        };

        resolveParams();
    }, [params]);


    /**
     * Used to Get Interview Details by MockId/Interview Id
     */
    const GetInterviewDetails = async () => {
        try {
            console.log("Fetching interview details for mockId:", params.interviewid);
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewid));

            console.log("Query result:", result); // Log the fetched result
            if (result.length > 0) {
                setInterviewData(result[0]);
            } else {
                console.warn("No data found for mockId:", params.interviewid);
            }
        } catch (error) {
            console.error("Error fetching interview data:", error);
        }
    };



    return (
        <div className='my-10 '>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

                <div className='flex flex-col my-5 gap-5 '>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        <h2 className='text-lg'><strong>Job Role/Job Position:</strong>{interviewData?.jobPosition} </h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{interviewData?.jobDescription} </h2>
                        <h2 className='text-lg'><strong>Years of Experience:</strong>{interviewData?.jobExperience} </h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'> <Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? <Webcam
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => setWebCamEnabled(false)}
                        mirrored={true}
                        style={{
                            height: 300,
                            width: 300
                        }}
                    />
                        :
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant="ghost" className="w-full" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    }
                </div>


            </div>
            <div className='flex justify-end items-end'>
                <Link href={'/dashboard/interview/' + params.interviewid + '/start'}>
                    <Button >Start Interview</Button>
                </Link>
            </div>


        </div>
    )
}

export default Interview;