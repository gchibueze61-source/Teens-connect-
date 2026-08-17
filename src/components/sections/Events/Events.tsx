import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import "./Events.css";

interface EventItem {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  status: string;
  featured: boolean;
  homepage: boolean;
}

interface DisplayEvent extends EventItem {
  actualDate: Date;
  actualDateTime: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/*
 * Get the 3rd Sunday of a particular month.
 */
function getThirdSunday(
  year: number,
  month: number
): Date {
  const date = new Date(year, month, 1);

  const firstDay = date.getDay();

  const daysUntilSunday =
    (7 - firstDay) % 7;

  const thirdSunday =
    1 + daysUntilSunday + 14;

  return new Date(
    year,
    month,
    thirdSunday
  );
}

/*
 * Get the next 3rd Sunday from the current date.
 */
function getNextThirdSunday(
  currentDate: Date
): Date {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const thisMonthSunday =
    getThirdSunday(year, month);

  if (
    thisMonthSunday.getTime() >
    currentDate.getTime()
  ) {
    return thisMonthSunday;
  }

  return getThirdSunday(
    month === 11
      ? year + 1
      : year,
    month === 11
      ? 0
      : month + 1
  );
}

/*
 * Build the actual date/time for an event.
 */
function getEventDateTime(
  event: EventItem
): Date {

  /*
   * Monthly Teens Meeting
   * happens every 3rd Sunday.
   */
  if (
    event.title
      .toLowerCase()
      .includes("monthly teens meeting")
  ) {
    const now = new Date();

    const thirdSunday =
      getNextThirdSunday(now);

    if (event.event_time) {
      const [
        hours,
        minutes,
      ] = event.event_time
        .split(":")
        .map(Number);

      thirdSunday.setHours(
        hours || 0,
        minutes || 0,
        0,
        0
      );
    } else {
      thirdSunday.setHours(
        0,
        0,
        0,
        0
      );
    }

    return thirdSunday;
  }

  /*
   * Normal one-time events.
   */
  const dateString =
    event.event_time
      ? `${event.event_date}T${event.event_time}`
      : `${event.event_date}T00:00:00`;

  return new Date(dateString);
}

/*
 * Countdown calculation.
 */
function getCountdown(
  targetDate: Date
): Countdown {
  const difference =
    targetDate.getTime() -
    Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24
    ),

    minutes: Math.floor(
      (difference /
        (1000 * 60)) %
        60
    ),

    seconds: Math.floor(
      (difference / 1000) %
        60
    ),
  };
}

/*
 * Countdown component.
 */
function CountdownTimer({
  targetDate,
}: {
  targetDate: Date;
}) {
  const [
    countdown,
    setCountdown,
  ] = useState<Countdown>(
    getCountdown(targetDate)
  );

  useEffect(() => {
    const timer =
      setInterval(() => {
        setCountdown(
          getCountdown(targetDate)
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="event-countdown">

      <p className="countdown-title">
        Countdown
      </p>

      <div className="countdown-grid">

        <div className="countdown-box">
          <strong>
            {countdown.days}
          </strong>

          <span>
            Days
          </span>
        </div>

        <div className="countdown-box">
          <strong>
            {countdown.hours}
          </strong>

          <span>
            Hours
          </span>
        </div>

        <div className="countdown-box">
          <strong>
            {countdown.minutes}
          </strong>

          <span>
            Minutes
          </span>
        </div>

        <div className="countdown-box">
          <strong>
            {countdown.seconds}
          </strong>

          <span>
            Seconds
          </span>
        </div>

      </div>

    </div>
  );
}

export default function Events() {

  const [
    events,
    setEvents,
  ] = useState<EventItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * Load published homepage events
   * from Supabase.
   */
  useEffect(() => {

    const loadEvents =
      async () => {

        setLoading(true);
        setError("");

        const {
          data,
          error,
        } = await supabase
          .from("events")
          .select(
            `
              id,
              title,
              event_date,
              event_time,
              location,
              description,
              status,
              featured,
              homepage
            `
          )
          .eq(
            "status",
            "published"
          )
          .eq(
            "homepage",
            true
          )
          .order(
            "event_date",
            {
              ascending: true,
            }
          );

        if (error) {

          console.error(
            "EVENTS ERROR:",
            error
          );

          console.log(
            "EVENTS DATA:",
            data
          );

          setError(
            error.message
          );

          setEvents([]);

        } else {

          console.log(
            "EVENTS FROM SUPABASE:",
            data
          );

          setEvents(
            data || []
          );
        }

        setLoading(false);
      };

    loadEvents();

  }, []);

  /*
   * Convert database events into
   * displayable events.
   */
  const displayEvents:
    DisplayEvent[] =
    events
      .map((event) => {

        const actualDate =
          getEventDateTime(event);

        return {
          ...event,
          actualDate,
          actualDateTime:
            actualDate.toISOString(),
        };
      })
      .filter(
        (event) =>
          event.actualDate.getTime() >
          Date.now()
      )
      .sort(
        (a, b) =>
          a.actualDate.getTime() -
          b.actualDate.getTime()
      );

  /*
   * The first event is the closest
   * upcoming event.
   */
  const closestEvent =
    displayEvents.length > 0
      ? displayEvents[0]
      : null;

  return (
    <section
      className="events"
      id="events"
    >
      <div className="container">

        <div className="section-header">

          <h2>
            Upcoming Events
          </h2>

          <p>
            Stay connected with our latest
            programs, meetings and
            celebrations.
          </p>

        </div>

        {loading && (
          <div>
            Loading events...
          </div>
        )}

        {!loading &&
          error && (
            <div>
              {error}
            </div>
          )}

        {!loading &&
          !error &&
          displayEvents.length === 0 && (
            <div>
              No upcoming events at the moment.
            </div>
          )}

        {!loading &&
          !error &&
          displayEvents.length > 0 && (

            <div className="events-grid">

              {displayEvents.map(
                (event) => {

                  const formattedDate =
                    event.actualDate.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    );

                  const showCountdown =
                    closestEvent?.id ===
                    event.id;

                  return (
                    <div
                      className="event-card"
                      key={event.id}
                    >

                      <span className="event-status">
                        {event.featured
                          ? "Featured"
                          : event.status}
                      </span>

                      <h3>
                        {event.title}
                      </h3>

                      <p>
                        {event.description ||
                          "Join us for this upcoming event."}
                      </p>

                      <div className="event-info">

                        <span>
                          {formattedDate}
                        </span>

                        {event.location && (
                          <span>
                            {event.location}
                          </span>
                        )}

                      </div>

                      {showCountdown && (
                        <CountdownTimer
                          targetDate={
                            event.actualDate
                          }
                        />
                      )}

                      <button
                        type="button"
                      >
                        View Details
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </div>
    </section>
  );
}