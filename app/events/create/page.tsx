"use client";

import { useState, useRef } from "react";

export default function CreateEventPage() {
  // Core fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [overview, setOverview] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("offline");
  const [audience, setAudience] = useState("");
  const [organizer, setOrganizer] = useState("");

  // Tags & Agenda
  const [tags, setTags] = useState<string[]>([]);
  const [agenda, setAgenda] = useState<{ time: string; topic: string }[]>([]);
  const agendaTimeRef = useRef<HTMLInputElement>(null);
  const agendaTopicRef = useRef<HTMLInputElement>(null);

  // Image
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // UI control
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Handle image preview
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  // Handle agenda add
  function addAgendaItem() {
    const timeVal = agendaTimeRef.current?.value.trim();
    const topicVal = agendaTopicRef.current?.value.trim();

    if (!timeVal || !topicVal) return;

    setAgenda([...agenda, { time: timeVal, topic: topicVal }]);

    agendaTimeRef.current!.value = "";
    agendaTopicRef.current!.value = "";
  }

  // Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = new FormData();

    form.append("title", title);
    form.append("description", desc);
    form.append("overview", overview);
    form.append("venue", venue);
    form.append("location", location);
    form.append("date", date);
    form.append("time", time);
    form.append("mode", mode);
    form.append("audience", audience);
    form.append("organizer", organizer);

    form.append("tags", JSON.stringify(tags));
    form.append("agenda", JSON.stringify(agenda.map(a => `${a.time} | ${a.topic}`)));

    if (image) form.append("image", image);

    const res = await fetch("/api/events", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "Error creating event");
    } else {
      setMsg("Event created successfully!");
      // Reset form
      setTitle("");
      setDesc("");
      setOverview("");
      setVenue("");
      setLocation("");
      setDate("");
      setTime("");
      setMode("offline");
      setAudience("");
      setOrganizer("");
      setTags([]);
      setAgenda([]);
      setImage(null);
      setPreview(null);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-[#04292D] to-black py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-xl shadow-cyan-900/40">
        
        <h1 className="text-4xl font-bold text-white mb-10 text-center tracking-wide">
          Add a New Event 🚀
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* GRID 2-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-gray-300">Event Title</label>
              <input
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <label className="text-gray-300">Venue</label>
              <input
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-gray-300">Location</label>
              <input
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <label className="text-gray-300">Mode</label>
              <select
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none"
                value={mode}
                onChange={(e) => setMode((e.target.value).toLowerCase())}
              >
                <option>online</option>
                <option>offline</option>
                <option>hybrid</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-gray-300">Event Date</label>
              <input
                type="date"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-gray-300">Time</label>
              <input
                type="time"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {/* Audience */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-gray-300">Target Audience</label>
              <input
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            {/* Organizer */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-gray-300">Organizer</label>
              <input
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-4">
            <label className="text-gray-300">Event Description</label>
            <textarea
              rows={4}
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-cyan-400"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>

            <label className="text-gray-300">Event Overview</label>
            <textarea
              rows={3}
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-cyan-400"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            ></textarea>
          </div>

          {/* TAGS */}
          <div>
            <label className="text-gray-300">Tags</label>
            <input
              placeholder="Type a tag and press Enter"
              className="w-full mt-2 bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) setTags([...tags, val]);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-1 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                    className="text-red-300 hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* AGENDA BUILDER */}
          <div>
            <label className="text-gray-300">Agenda</label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <input
                ref={agendaTimeRef}
                type="time"
                className="bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
              />
              <input
                ref={agendaTopicRef}
                placeholder="Agenda Topic"
                className="bg-black/40 border border-white/10 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={addAgendaItem}
                className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold p-3 rounded-xl transition"
              >
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {agenda.map((item, i) => (
                <li
                  key={i}
                  className="bg-cyan-700/20 border border-cyan-600/20 text-cyan-200 p-3 rounded-xl flex justify-between"
                >
                  <span>
                    {item.time} — {item.topic}
                  </span>
                  <button
                    onClick={() =>
                      setAgenda(agenda.filter((_, idx) => idx !== i))
                    }
                    className="text-red-300 hover:text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* IMAGE UPLOAD + PREVIEW */}
<div className="space-y-4">
  <label className="text-gray-300 ">Event Cover Image</label>

  {/* Upload Box */}
  <div
    className="w-full border-2 border-dashed border-cyan-600/40 bg-black/40 rounded-2xl p-6 cursor-pointer 
    hover:border-cyan-400 hover:bg-black/30 transition group mt-3"
    onClick={() => document.getElementById("event-image")?.click()}
  >
    {!preview ? (
      <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">

        {/* Upload Icon */}
        <svg
          className="w-14 h-14 text-cyan-400 group-hover:text-cyan-300 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 9l4.5-4.5m0 0L16.5 9m-4.5-4.5V15"
          />
        </svg>

        <p className="text-gray-400 text-sm text-center">
          Click to upload or drag your event image here
        </p>

        <p className="text-cyan-300 text-xs">PNG, JPG, or JPEG (Max 5MB)</p>
      </div>
    ) : (
      <>
        {/* PREVIEW CARD */}
        <div className="relative w-full flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="w-72 rounded-2xl shadow-xl border border-cyan-500/20"
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setImage(null);
            }}
            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white 
            p-2 rounded-full shadow-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-center text-gray-300 text-sm mt-2">
          Click again to choose a different image
        </p>
      </>
    )}
  </div>

  {/* Hidden File Input */}
  <input
    id="event-image"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageUpload}
    required={!preview}
  />
</div>


          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded-2xl text-lg shadow-xl shadow-cyan-900/40 transition"
          >
            {loading ? "Creating Event..." : "Publish Event 🚀"}
          </button>

          {msg && (
            <p className="text-center text-cyan-300 text-lg mt-4">{msg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
