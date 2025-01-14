import React from 'react';
import { StyleSheet, TextInput, Image, Text, View, Button, TouchableOpacity, Pressable, Platform } from 'react-native';
import { useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {

  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Quar.', 'Quin.', 'Sext.', 'Sáb.'],
  today: "Hoje"
};

LocaleConfig.defaultLocale = 'fr';

export function Calendario({ navigation }) {

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const onDayPress = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Selecionando data de início
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
      setMarkedDates({ [day.dateString]: { selected: true, color: 'green' } });
    } else {
      // Selecionando data de saída
      const start = new Date(selectedStartDate);
      const end = new Date(day.dateString);
      const dateRange = {};
      let currentDate = new Date(start);
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        dateRange[dateString] = { selected: true, color: 'green' };
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setSelectedEndDate(day.dateString);
      setMarkedDates(dateRange);
    }
  };

  const agendar = () => {
    fetch('http://localhost/api/agendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dt_checkin: selectedStartDate,
        dt_checkout: selectedEndDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
  };

  function validaAgendamento() {
    // alert("Seu pedido de reserva foi enviado com sucesso! ");
    agendar();
    // navigation.navigate('Home');
  };

  


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Agendamento no Hotel</Text>
      </View>
      <View>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          enableSwipeMonths={true}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            margin: 25
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e'
            }}
        />
      </View>
      <View>
        <TextInput
          placeholder='Check in'
          style={styles.input}
          value={selectedStartDate !== null ? selectedStartDate : ''}
          keyboardType="numeric"
        />
        <TextInput
          placeholder='Check out'
          style={styles.input}
          value={selectedEndDate !== null ? selectedEndDate : ''}
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginHorizontal: 25, marginTop: 10 }}>
        <TouchableOpacity style={styles.button} onPress={validaAgendamento}>
          <Text style={styles.textButton}>Agendar</Text>
        </TouchableOpacity>
        {/* <Text style={styles.texto}>
          xx/xx horário especial de funcionamento.
          ( 10 às 16h ) para check in
        </Text> */}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EAD0',

  },
  calendario: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#273A73',
    borderRadius: 20,
  },

  link: {
    alignItems: 'center',
    marginTop: 100,
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#273A73',
    fontSize: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#273A73',
    padding: 10,
    borderRadius: 10,
    width: '90%'

  },

  // input:focus {
  //   bordercolor: #FF0000; 
  // },

  logo: {
    alignSelf: 'center',
  },
  logo2: {
    height: 90,
    width: 90,
  },

  button: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#273A73',
    width: '40%',
    padding: 10,
    borderRadius: 20,
    shadowRadius: 10,
  },
  button2: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#6FAA9C',
    width: '40%',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    shadowRadius: 10,
  },
  texto: {
    textAlign: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowRadius: 3,
    marginTop: 30,
    color: '#273A73',
    fontSize: 20,
  },
  header: {
    textAlign: 'center',
    flex: 0,
    fontSize: 26,
    margin: 20,
    marginBottom: 0
  },
  textButton: {
    color: 'white',
    fontSize: 20
  }
});