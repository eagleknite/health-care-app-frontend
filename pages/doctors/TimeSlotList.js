// pages\doctors\TimeSlotList.js
const TimeSlotList = ({ timeSlots = [] }) => {
  return (
    <ul>
      {timeSlots.map((slot, index) => (
        <li key={index}>
          {slot.day} {slot.start} - {slot.end}
          <button>Edit</button>
          <button>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TimeSlotList;
