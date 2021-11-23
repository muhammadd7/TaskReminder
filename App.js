import React, {useState} from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Button,
  TextInput,
  View,
  TextInputBase,
  Touchable,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReactNativeAN from 'react-native-alarm-notification';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SQLite from 'react-native-sqlite-storage';
const Tab = createBottomTabNavigator();

const db = SQLite.openDatabase(
  {
    name: 'TaskReminder.db',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

function HomeScreen() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: 'grey',
        inactiveTintColor: 'lightgray',
        activeBackgroundColor: '#7070A8',
        inactiveBackgroundColor: '#7070A8',
      }}>
      <Tab.Screen
        name="Add Tasks"
        component={AddTasks}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./android/app/src/main/Images/AddTask.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FFCA3C' : 'black',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FFCA3C' : 'black',
                  fontSize: 12,
                }}>
                Add Tasks
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="My Tasks"
        component={MyTasks}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./android/app/src/main/Images/ViewTask.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#FFCA3C' : 'black',
                }}
              />
              <Text
                style={{
                  color: focused ? '#FFCA3C' : 'black',
                  fontSize: 12,
                }}>
                My Tasks
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export const AddTasks = ({navigation}) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');
  const [udate, setUdate] = useState('Empty');
  const [mytime, setMytime] = useState('Empty');
  const [title, setTitle] = useState('Empty');
  const [description, setDescription] = useState('Empty');



  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getFullYear();
    let fTime =
      tempDate.getHours() +
      ':' +
      tempDate.getMinutes() +
      ':' +
      tempDate.getSeconds();
    setText(fDate + ' ' + fTime);
    setUdate(fDate);
    setMytime(fTime);
    console.log(udate);
    console.log(mytime);
    console.log(title);
    console.log(description);
    db.transaction(tx => {
      // Loop would be here in case of many values
      tx.executeSql(
        'INSERT INTO Task (Title, Description, RDate, RTime) VALUES (?,?,?,?)',
        [title, description, fDate, fTime],
        (tx, results) => {
          console.log('Insert Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Success', 'User updated successfully');
          } else {
            alert('Updation Failed');
          }
        },
      );
    });
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1E30',
      }}>
      <TextInput
        onChangeText={tit => setTitle(tit)}
        placeholder="Add Task Title"
        placeholderTextColor="white"
        style={{
          width: 300,
          borderWidth: 1,
          borderRadius: 90,
          backgroundColor: '#373753',
          textAlign: 'center',
        }}
      />
      <TextInput
        onChangeText={desc => setDescription(desc)}
        placeholder="Add Task Description"
        placeholderTextColor="white"
        style={{
          width: 300,
          height: 50,
          borderWidth: 1,
          borderRadius: 90,
          marginTop: 20,
          backgroundColor: '#373753',
          textAlign: 'center',
        }}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginTop: 30}}>
          <Button onPress={showDatepicker} title="Set Date" />
        </View>
        <View style={{marginTop: 30, marginLeft: 30}}>
          <Button onPress={showTimepicker} title="Set Time" />
        </View>
      </View>
      <View
        style={{
          width: 300,
          height: 50,
          borderWidth: 1,
          borderRadius: 90,
          marginTop: 20,
          backgroundColor: '#373753',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white'}}>{text}</Text>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          width: 300,
          height: 50,
          justifyContent: 'center',
          borderRadius: 90,
          marginTop: 20,
          backgroundColor: '#FFCA3C',
        }}
        onPress={() => Alert.alert('Reminder Saved Succesfully')}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>SAVE</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          //is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'A',
    key: 0,
    lastname: 'Last Name',
    data: [
      {key: 0, title: 'Muhammad Umair'},
      {key: 1, title: 'User 2'},
      {key: 2, title: 'User 3'},
      {key: 3, title: 'User 4'},
    ],
  },
];

function MyTasks() {
  return (
    <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1F1E30',
    }}>
      <FlatList
        sections={DATA}
        renderItem={({item, section}) => (
          <View
            style={{
              backgroundColor: 'grey',
              padding: 5,
              marginBottom: 5,
              height: 40,
            }}>
            <Text> {item.title} </Text>
          </View>
        )}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
