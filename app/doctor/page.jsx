"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DoctorPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    nextWeekVisits: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [visitData, setVisitData] = useState({
    labels: [],
    datasets: [
      {
        label: "Patient Visits",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  const [demographicsData, setDemographicsData] = useState({
    labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
    datasets: [
      {
        label: "Patient Age Groups",
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch statistics data
        const statsResponse = await fetch("/api/doctor/stats");
        const statsData = await statsResponse.json();

        setStats({
          totalPatients: statsData.totalPatients || 0,
          totalVisits: statsData.totalPrescriptions || 0,
          nextWeekVisits: statsData.nextWeekVisits || 0,
        });

        // Fetch upcoming appointments
        const appointmentsResponse = await fetch("/api/doctor/appointments");
        const appointmentsData = await appointmentsResponse.json();
        setUpcomingAppointments(appointmentsData.appointments || []);

        // Fetch patient visits trend
        const visitsResponse = await fetch("/api/doctor/visits-trend");
        const visitsData = await visitsResponse.json();
        setVisitData({
          labels: visitsData.labels || [],
          datasets: [
            {
              label: "Patient Visits",
              data: visitsData.data || [],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });

        // Fetch demographics data
        const demographicsResponse = await fetch("/api/doctor/demographics");
        const demographicsData = await demographicsResponse.json();
        setDemographicsData({
          labels: demographicsData.labels || [
            "0-18",
            "19-35",
            "36-50",
            "51-65",
            "65+",
          ],
          datasets: [
            {
              label: "Patient Age Groups",
              data: demographicsData.data || [0, 0, 0, 0, 0],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Total Patients
          </h3>
          <p className="text-3xl font-bold">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Total Visits
          </h3>
          <p className="text-3xl font-bold">{stats.totalVisits}</p>
          <p className="text-xs text-gray-500">Total prescriptions till date</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Next Week Visits
          </h3>
          <p className="text-3xl font-bold">{stats.nextWeekVisits}</p>
          <p className="text-xs text-gray-500">
            Follow-ups scheduled for next week
          </p>
        </div>
      </div>

      {/* Charts and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Patient Visits Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Patient Visits Trend</h2>
          <div className="h-64">
            <Line data={visitData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Patient Age Distribution
          </h2>
          <div className="h-64">
            <Bar
              data={demographicsData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Patient</th>
                  <th className="text-left py-2">Doctor</th>
                  <th className="text-left py-2">Next Visit Date</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3">{appointment.patientName}</td>
                    <td className="py-3">{appointment.doctorName}</td>
                    <td className="py-3">{formatDate(appointment.date)}</td>
                    <td className="py-3">
                      <Link
                        href={`/doctor/patients/${appointment.patientId}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Visit Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No upcoming appointments scheduled.</p>
        )}
      </div>
    </div>
  );
}
