import { ScreenTimeData } from './types';

export const MOCK_DATA: ScreenTimeData = {
  totalMinutes: 480, // 8 hours
  categories: [
    {
      name: "Social Interaction",
      color: "#E57373", // Soft Red
      children: [
        { name: "Instagram", minutes: 120, color: "#F48FB1" },
        { name: "WhatsApp", minutes: 45, color: "#81C784" },
        { name: "Twitter", minutes: 30, color: "#64B5F6" },
        { name: "Discord", minutes: 60, color: "#7986CB" }
      ]
    },
    {
      name: "Productivity & Focus",
      color: "#64B5F6", // Soft Blue
      children: [
        { name: "VS Code", minutes: 180, color: "#4FC3F7" },
        { name: "Notion", minutes: 40, color: "#90A4AE" },
        { name: "Gmail", minutes: 15, color: "#EF5350" },
        { name: "Terminal", minutes: 25, color: "#263238" }
      ]
    },
    {
      name: "Entertainment",
      color: "#FFB74D", // Soft Orange
      children: [
        { name: "YouTube", minutes: 90, color: "#E53935" },
        { name: "Netflix", minutes: 60, color: "#B71C1C" },
        { name: "Spotify", minutes: 120, color: "#1DB954" }
      ]
    },
    {
      name: "Education & Reading",
      color: "#81C784", // Soft Green
      children: [
        { name: "Medium", minutes: 30, color: "#000000" },
        { name: "Kindle", minutes: 50, color: "#0074B1" },
        { name: "Duolingo", minutes: 20, color: "#58CC02" }
      ]
    },
    {
      name: "Utilities",
      color: "#BA68C8", // Soft Purple
      children: [
        { name: "Settings", minutes: 10, color: "#757575" },
        { name: "Clock", minutes: 5, color: "#FFEB3B" },
        { name: "Weather", minutes: 8, color: "#00B0FF" }
      ]
    }
  ]
};
