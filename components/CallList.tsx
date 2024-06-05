'use client'
import React, { useEffect, useState } from 'react'
import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import MeetingCard from './MeetingCard';
import { Loader } from 'lucide-react';
import { useToast } from './ui/use-toast';

const CallList = ({type}: {type: 'ended' | 'upcoming' | 'recordings'}) => {
  const {toast} = useToast()
  const router = useRouter();
  const {endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const getCalls = () => {
    switch(type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upcomingCalls;
      case 'recordings':
        return callRecordings;
      default:
        return [];
    }
  }

  const getNoCallMessages = () => {
    switch(type) {
      case 'ended':
        return 'No previous Calls';
      case 'upcoming':
        return 'No upcoming Calls';
      case 'recordings':
        return 'No recordings';
      default:
        return '';
    }
  }

  useEffect(() => {

    const fetchRecordings = async () => {
      const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []);

      const recordings = callData.filter((call) => call.recordings.length>0)
      .flatMap((call) => call.recordings);

      setRecordings(recordings);
    }

    if(type==='recordings'){
      fetchRecordings();
    }

  }, [type, callRecordings])

  
  if(isLoading) return <Loader/>

  const calls = getCalls();
  const noCallMessages = getNoCallMessages();

  return (
    
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>

      {calls && calls.length>0 ? calls.map((meeting: Call | CallRecording) => (
        <MeetingCard key={(meeting as Call).id}
          icon={ type === 'ended'? '/icons/previous.svg': type === 'upcoming'? '/icons/upcoming.svg': '/icons/recordings.svg'}
          date={(meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time?.toLocaleString()}
          title={(meeting as Call).state?.custom?.description || (meeting as CallRecording)?.filename?.substring(0,20) || 'Personal Meeting'}
          isPreviousMeeting={type === 'ended'}
          buttonIcon1={type === 'recordings' ? '/icons/play.svg': undefined}
          buttonText={type === 'recordings' ? 'Play' : 'Start'}
          handleClick={type === 'recordings' ? () => router.push(`${(meeting as CallRecording).url}`) : () => router.push(`/meeting/${(meeting as Call).id}`)}
          link={type === 'recordings' ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
        />        
      )): (
        <h1 className="text-2xl font-bold text-white">{noCallMessages}</h1>
      )}

    </div>

  )
}

export default CallList