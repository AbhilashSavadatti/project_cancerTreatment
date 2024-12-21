import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Video from 'twilio-video';

const VideoCall = () => {
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState(null);
  const [identity, setIdentity] = useState("patient"); // Unique identity for the user (can be dynamic)
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Fetch Twilio token from backend
    const fetchToken = async () => {
      const response = await axios.post("http://localhost:5000/generate-token", { identity });
      setToken(response.data.token);
    };

    fetchToken();
  }, [identity]);

  const startCall = async () => {
    if (!token) {
      console.error("No token found!");
      return;
    }

    // Connect to the Twilio Video room
    const room = await Video.connect(token, {
      name: "cancer-appointment-room",
      audio: true,
      video: { width: 640 },
    });

    setRoom(room);

    // Attach the local video stream
    const localTrack = room.localParticipant.videoTracks.values().next().value.track;
    localVideoRef.current.srcObject = new MediaStream([localTrack]);

    // Attach the remote video stream
    room.on("participantConnected", (participant) => {
      participant.on("trackSubscribed", (track) => {
        if (track.kind === "video") {
          remoteVideoRef.current.srcObject = track.mediaStream;
        }
      });
    });
  };

  const endCall = () => {
    if (room) {
      room.disconnect();
    }
  };

  return (
    <div>
      <h2 className="text-white">Video Call Appointment</h2>
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px" }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
      </div>
      <div>
        <button className="text-white"  onClick={startCall}>Start Call</button>
        <div className=""></div>
        <button className="text-white" onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;
