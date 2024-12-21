import React, { useRef,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAlertCircle,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { usePrivy } from "@privy-io/react-auth";
import MetricsCard from "./MetricsCard"; // Adjust the import path
import { useStateContext } from "../context"; // Ensure correct import path


const DisplayInfo = () => {
  const [showChat , setShowChat] = useState(false);
  const navigate = useNavigate();
  const { user } = usePrivy();
  const { fetchUserRecords, records, fetchUserByEmail } = useStateContext();
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    aiPersonalizedTreatment: 0,
    totalScreenings: 0,
    completedScreenings: 0,
    pendingScreenings: 0,
    overdueScreenings: 0,
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory(prev => [...prev, { type: 'question', content: currentQuestion }]);

    try {
      // Set up a prompt to limit the chatbot's responses to cancer or medical topics only
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `You are a medical chatbot focused on cancer-related information. Only respond to questions that are related to cancer or health topics. If the question is not related to cancer or health, reply with "I can only assist with cancer or health-related questions." Here is the question: "${currentQuestion}"`,
                },
              ],
            },
          ],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory(prev => [...prev, { type: 'answer', content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  useEffect(() => {
    if (user) {
      fetchUserByEmail(user.email.address)
        .then(() => {
          console.log(records);
          const totalFolders = records.length;
          let aiPersonalizedTreatment = 0;
          let totalScreenings = 0;
          let completedScreenings = 0;
          let pendingScreenings = 0;
          let overdueScreenings = 0;

          records.forEach((record) => {
            if (record.kanbanRecords) {
              try {
                const kanban = JSON.parse(record.kanbanRecords);
                aiPersonalizedTreatment += kanban.columns.some(
                  (column) => column.title === "AI Personalized Treatment",
                )
                  ? 1
                  : 0;
                totalScreenings += kanban.tasks.length;
                completedScreenings += kanban.tasks.filter(
                  (task) => task.columnId === "done",
                ).length;
                pendingScreenings += kanban.tasks.filter(
                  (task) => task.columnId === "doing",
                ).length;
                overdueScreenings += kanban.tasks.filter(
                  (task) => task.columnId === "overdue",
                ).length;
              } catch (error) {
                console.error("Failed to parse kanbanRecords:", error);
              }
            }
          });

          setMetrics({
            totalFolders,
            aiPersonalizedTreatment,
            totalScreenings,
            completedScreenings,
            pendingScreenings,
            overdueScreenings,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user, fetchUserRecords, records]);

  const metricsData = [
    {
      title: "Specialist Appointments Pending",
      subtitle: "View",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/appointments/pending"),
    },
    {
      title: "Treatment Progress Update",
      subtitle: "View",
      value: `${metrics.completedScreenings} of ${metrics.totalScreenings}`,
      icon: IconCircleDashedCheck,

      onClick: () => navigate("/treatment/progress"),
    },
    {
      title: "Total Folders",
      subtitle: "View",
      value: metrics.totalFolders,
      icon: IconFolder,
      onClick: () => navigate("/folders"),
    },
    {
      title: "Total Screenings",
      subtitle: "View",
      value: metrics.totalScreenings,
      icon: IconUserScan,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Completed Screenings",
      subtitle: "View",
      value: metrics.completedScreenings,
      icon: IconCircleDashedCheck,
      onClick: () => navigate("/screenings/completed"),
    },
    {
      title: "Pending Screenings",
      subtitle: "View",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/screenings/pending"),
    },
    {
      title: "Overdue Screenings",
      subtitle: "View",
      value: metrics.overdueScreenings,
      icon: IconAlertCircle,
      onClick: () => navigate("/screenings/overdue"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-[26px]">
      <div className="mt-7 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        {metricsData.slice(0, 2).map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-[9px] grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {metricsData.slice(2).map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>

{showChat && (
    <div className="bg-[#13131a] fixed right-12 bottom-[calc(5rem+1.5rem)] hover:cursor-pointer p-1 shadow-md rounded-lg
                border h-[550px] w-[460px] ">
       <div className="bg-[#13131a]">
      <div className="bg-[#13131a]">
       

        <div 
          ref={chatContainerRef}
          className="flex-1 h-[450px] overflow-y-auto mb-1 m-2 rounded-md bg-white shadow-lg p-3 hide-scrollbar"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-blue-50 flex flex-col  rounded-md h-full w-full">
                <h2 className="text-sm p-8 font-bold text-green-500 mb-4">Welcome to Cancer care! 👋</h2>
                <p className="text-gray-600 mb-4">
                  I'm here to help you with questions related to cancer and health.
                </p>
    
                <p className="text-gray-500 mt-20 text-sm">
                  Just type your question below and press Enter or click Send!
                </p>
            
                
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`mb-4 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                  <div className={`h-full inline-block mt-5 max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                    chat.type === 'question' 
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-[#13131a] text-white rounded-bl-none'
                  }`}>
                    <ReactMarkdown className="overflow-auto hide-scrollbar">{chat.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                please wait
              </div>
            </div>
          )}
        </div>

        <form onSubmit={generateAnswer} className="bg-black rounded-lg shadow-lg p-3 ">
          <div className="flex h-[54px] gap-2">
            <textarea
              required
              className="flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 text-md focus:ring-1 focus:ring-blue-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about cancer or health..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6  bg-green-500 text-white rounded-md hover:bg-green-400 transition-colors ${
                generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
)}


      <button
      onClick={() => setShowChat(!showChat)}
      className='fixed right-12 bottom-[calc(1rem)] hover:cursor-pointer'
    class="fixed bottom-7 right-10 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
    type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed">
    <svg xmlns=" http://www.w3.org/2000/svg" width="50" height="40" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="text-green-400 block border-gray-200 align-middle">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" class="border-gray-200">
      </path>
    </svg>
    
  </button>
    </div>
  );
};

export default DisplayInfo;