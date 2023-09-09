import React, {useState} from 'react';
import {Button} from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerComp = ({date, isOpen, onDateChange, onClose}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateConfirm = newDate => {
    setSelectedDate(newDate);
    onDateChange(newDate);
    setOpen(false);
  };

  return (
    <>
      {/* <Button title="Open" onPress={() => setOpen(true)} /> */}
      <DatePicker
        modal
        mode="date"
        open={isOpen}
        date={selectedDate || new Date()} // Use selectedDate or current date
        onConfirm={handleDateConfirm}
        onCancel={() => {
          setOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default DatePickerComp;
