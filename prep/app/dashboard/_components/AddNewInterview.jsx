"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDescription, jobExperience);

    const InputPrompt = "Job Position: " + jobPosition + ", Job Description: " + jobDescription + ", Years Of Experience: " + jobExperience + " Depends on this information please give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " Interview questions with answers in JSON format, Give me questions and answers as field in JSON.";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    console.log(JSON.parse(MockJsonResp));

    setJsonResponse(MockJsonResp);

    let resp = null; // Define resp here

    if (MockJsonResp) {
      resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDescription: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        }).returning({ mockId: MockInterview.mockId });

      console.log("Inserted Id:", resp);
    } else {
      console.log('Error generating JSON response.');
    }

    if (resp) {
      setOpenDialog(false);
      router.push('/dashboard/interview/' + resp[0]?.mockId);
    } else {
      console.log("ERROR: Failed to insert data into the database!");
    }

    setLoading(false);
  };


  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              Please provide details about the job position, description, and years of experience.
            </DialogDescription>
          </DialogHeader>
          {/* Move the form outside DialogDescription */}
          <form onSubmit={onSubmit}>
            <div>
              <h2 className="text-lg font-semibold">
                Add details about your job position/role, job description, and years of experience
              </h2>
              <div className="mt-7 my-4">
                <label>Job Role/Job Position</label>
                <Input
                  placeholder="EX. Full Stack Developer"
                  required
                  onChange={(event) => setJobPosition(event.target.value)}
                />
              </div>
              <div className="mt-2 my-4">
                <label>Job Description/Tech Stack</label>
                <Textarea
                  placeholder="Ex. React, Angular, NodeJs, MySQL, etc."
                  required
                  onChange={(event) => setJobDesc(event.target.value)}
                />
              </div>
              <div className="mt-2 my-4">
                <label>Years Of Experience</label>
                <Input
                  type="number"
                  placeholder="5"
                  max="100"
                  required
                  onChange={(event) => setJobExperience(event.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-5 justify-end">
              <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Generating from AI
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>

  )
}
export default AddNewInterview