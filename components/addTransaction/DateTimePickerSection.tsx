import { createStyles } from '@/components/addTransaction/styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { formatDateToDDMMYYYY } from '@/utils/dateFormatter';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function DateTimePickerSection({
  date,
  time,
  onChangeDate,
  onChangeTime,
}: {
  date: Date;
  time: Date;
  onChangeDate: (d: Date) => void;
  onChangeTime: (d: Date) => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const styles = createStyles(
    useThemeColor({}, 'background'),
    useThemeColor({}, 'cardBackgroundColor'),
    useThemeColor({}, 'text'),
    useThemeColor({}, 'tint')
  );
  const iconColor = useThemeColor({}, 'text');

  const formatDate = (d: Date) => formatDateToDDMMYYYY(d);
  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Date & Time</ThemedText>
      <ThemedView style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
          <AntDesign name="calendar" size={20} color={iconColor} />
          <ThemedText style={styles.dateTimeButtonText}>{formatDate(date)}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
          <AntDesign name="clockcircleo" size={20} color={iconColor} />
          <ThemedText style={styles.dateTimeButtonText}>{formatTime(time)}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) onChangeDate(d);
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(e, t) => {
            setShowTimePicker(false);
            if (t) onChangeTime(t);
          }}
        />
      )}
    </ThemedView>
  );
}
