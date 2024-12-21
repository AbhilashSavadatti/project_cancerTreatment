import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../utils/dbConfig"; // Corrected import
import { appointments } from "../utils/schema"; // Correct path to schema

const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = async () => {
    try {
      await db.insert(appointments).values({
        patient_id: "patient-id-123", // Replace with dynamic patient data
        doctor_id: "doctor-id-123", // Replace with dynamic doctor data
        appointment_date: selectedDate,
      });
      alert("Appointment scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  };

  return (
    <div>
      <h2>Schedule an Appointment</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Schedule Appointment
      </button>
    </div>
  );
};

export default AppointmentScheduler;
