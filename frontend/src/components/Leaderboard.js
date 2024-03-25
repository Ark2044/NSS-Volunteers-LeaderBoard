//Leaderboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "/get-all-volunteers";

function Leaderboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(apiUrl);

        // Log the entire response to inspect its structure
        console.log("Full response:", response);

        // Set state with the response data directly
        setVolunteers(response.data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        setError("Error fetching volunteers. See console for details.");
      }
    };

    fetchVolunteers();
  }, []);

  const getGrandBandra = (volunteer) => {
    return volunteer.eventsattained.reduce((total, event) => {
      if (event && event.eventcategory === "AREA BASED PROJECT 1 (BANDRA)" && event.hoursalloted) {
        const parsedHours = parseInt(event.hoursalloted, 10);
        return total + (isNaN(parsedHours) ? 0 : parsedHours);
      } else {
        return total;
      }
    }, 0);
  };
  
  const getGrandAndheri = (volunteer) => {
    return volunteer.eventsattained.reduce((total, event) => {
      if (event && event.eventcategory === "AREA BASED PROJECT 2 (ANDHERI)" && event.hoursalloted) {
        const parsedHours = parseInt(event.hoursalloted, 10);
        return total + (isNaN(parsedHours) ? 0 : parsedHours);
      } else {
        return total;
      }
    }, 0);
  };
  
  const getGrandCollege = (volunteer) => {
    return volunteer.eventsattained.reduce((total, event) => {
      if (event && event.eventcategory === "COLLEGE BASED ACTIVITY" && event.hoursalloted) {
        const parsedHours = parseInt(event.hoursalloted, 10);
        return total + (isNaN(parsedHours) ? 0 : parsedHours);
      } else {
        return total;
      }
    }, 0);
  };
  
  const getGrandMU = (volunteer) => {
    return volunteer.eventsattained.reduce((total, event) => {
      if (event && event.eventcategory === "MUMBAI UNIVERSITY EVENT" && event.hoursalloted) {
        const parsedHours = parseInt(event.hoursalloted, 10);
        return total + (isNaN(parsedHours) ? 0 : parsedHours);
      } else {
        return total;
      }
    }, 0);
  };

  const getDeduction = (volunteer) => {
    return volunteer.eventsattained.reduce((total, event) => {
      if (event && event.eventcategory === "DEDUCTION*" && event.hoursalloted) {
        const parsedHours = parseInt(event.hoursalloted, 10);
        return total + (isNaN(parsedHours) ? 0 : parsedHours);
      } else {
        return total;
      }
    }, 0);
  };


  
  const getGrandTotal = (volunteer) => {
    return volunteer.eventsattained.reduce((total, event) => {
      if (event && event.hoursalloted) {
        // Convert hoursalloted to a number
        const parsedHours = parseInt(event.hoursalloted, 10);

        // Add the parsed hours to the total, considering 0 for strings
        return total + (isNaN(parsedHours) ? 0 : parsedHours);
      } else {
        console.error("Invalid event structure:", event);
        return total; // Skip this event and continue with others
      }
    }, 0);
  };

  // Sort volunteers based on grand total hours in descending order
  const sortedVolunteers = [...volunteers].sort(
    (a, b) => getGrandTotal(b) - getGrandTotal(a)
  );

  return (
    <div>
      <h1 id="title">Leaderboard</h1>

      {error && <p>Error: {error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Position</th>
            <th>Serial Number</th>
            <th>Name</th>
            <th>Grand Total Bandra</th>
            <th>Grand Total Andheri</th>
            <th>Grand Total College</th>
            <th>Grand Total MU</th>
            <th>Deduction</th>
            <th>Grand Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {sortedVolunteers.map((volunteer, index) => (
            <tr key={volunteer.srno}>
              <td>{index + 1}</td>
              <td>{volunteer.srno}</td>
              <td>{volunteer.name}</td>
              <td>{getGrandBandra(volunteer)}</td>
              <td>{getGrandAndheri(volunteer)}</td>
              <td>{getGrandCollege(volunteer)}</td>
              <td>{getGrandMU(volunteer)}</td>
              <td>{getDeduction(volunteer)}</td>
              <td>{getGrandTotal(volunteer)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
