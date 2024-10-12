"use client"; // Required to use useState and useEffect

import { useState, useEffect } from 'react';

export default function Home() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Explicitly typing the error state

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurant_id: 1, // Assuming you're using restaurant ID 1
            day_of_week: 'Monday', // Example day
            num_male_employees: 10,
            num_female_employees: 5
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        setSchedule(data?.employees || []); // Ensure employees array exists
      } catch (error: unknown) {
        // Use a type guard to check if the error is an instance of Error
        if (error instanceof Error) {
          setError(error.message); // Accessing the message property safely
        } else {
          setError('Something went wrong'); // Fallback error message
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);
// Empty dependency array ensures it runs only on component mount

  return (
    <div>
      <h2 className="text-xl font-bold">Employee Schedule</h2>

      {isLoading ? (
        <p>Loading...</p> // Show loading message while fetching
      ) : error ? (
        <p>Error: {error}</p> // Display error if fetching fails
      ) : schedule.length > 0 ? (
        <ul className="list-disc mt-4">
          {schedule.map((employee, index) => (
            <li key={index}>
              {employee["employee_name"]} - Shift: {employee["shift"]} - Salary: {employee["salary"]}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
}
