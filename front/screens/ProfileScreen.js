import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  TextInput
} from "react-native";
import axios from "axios";
import * as Progress from 'react-native-progress';

// Local components import
import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import BookView from "../components/molecules/BookView";
import Paragraph from "../components/atoms/Paragraph";

import { AuthContext } from "../context/auth";
import { BookContext } from "../context/book";
import { theme } from "../core/theme";

const HMINUTE_MS = 30000;

export default function ProfileScreen({ navigation }) {
  const [savedBooks, setSavedBooks] = useContext(BookContext);
  const [state, setState] = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [readingList, setReadingList] = useState(0);
  const [works, setWorks] = useState(0);
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isProfileView, setIsProfileView] = useState(true);
  const [xp, setXp] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [level, setlevel] = useState(1);


  var key_id = 0;

  useEffect(() => {
    gatherData();

    const interval = setInterval(() => {
      gatherData();
    }, HMINUTE_MS);

    return () => clearInterval(interval);
  }, [state]);

  const WelcomeView = () => {
    return (
      <View style={styles.container2}>
      <View style={styles.inputGroup}>
        <View style={styles.level}>
        <Text style={styles.text}>LEVEL: {level}</Text>
        <Text style={styles.text}>XP: {(xp*100).toFixed(1)}%</Text>
        </View>
        <Progress.Bar progress={xp} width={400}/>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.text}>Pages Read Today: {pagesRead*20}</Text>
        <Progress.Bar progress={pagesRead} width={400}/>
      </View>
    </View>
    );
  };

  const gatherData = () => {
    if (state) {
      if (state.user === null) {
        return;
      }
      // Show the username and email of the logged user
      const { id, username, email } = state.user;
      setUsername(username);
      setEmail(email);
      setReadingList(savedBooks.length);

      fetchBooks(username);

      showFollowers(username);
    }
  };

  const showFollowers = async (username) => {
    try {
      const resp = await axios.get(
        "http://localhost:8080/api/getFollowers",
        {
          params: {
            userID: username,
          },
        }
      );
      console.log(username)
      console.log(resp.data.followers);
      console.log(resp.data.following);
      setFollowers(resp.data.followers.length);
      setFollowing(resp.data.following.length);
  }catch(e){
    console.log(e)
  }
  }

  // Get the user's work
  const fetchBooks = async (username) => {
    // to get the parameters passed in the SearchScreen -> route.params

    try {
      const resp = await axios.get(
        "http://localhost:8080/api/auth/getUserBooks",
        {
          params: {
            userID: username,
          },
        }
      );

      // If nothing changed with the user's works
      if (resp.data.message !== books) {
        setBooks(resp.data.message);
        setWorks(resp.data.message.length);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const viewBook = async (item) => {
    navigation.navigate("BookViewScreen", {
      author: item.username,
      title: item.title,
      content: item.content,
      views: item.views,
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    gatherData();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const experience = async () => {

    setIsProfileView(false);
    try {
      const resp = await axios.get(
        "http://localhost:8080/api/getXPData",
        {
          params: {
            userID: username,
          },
        }
      );
      console.log(resp.data);

      const value = resp.data.xp[1] / resp.data.xp[2];
      const pagesReadValue = resp.data.dailyRead/ 20;

      setXp(value > 1 ? 1 : value);
      setPagesRead(pagesReadValue)
      setlevel(resp.data.xp[0]);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <DarkBackgroundS>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header and title parts */}
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: "bold", color: "#64CCC5" }}>
                {" "}
                USERNAME:
              </Text>
              <Text> {username}</Text>
            </Text>

            <Text style={styles.infoText}>
              <Text style={{ fontWeight: "bold", color: "#64CCC5" }}>
                {" "}
                EMAIL:
              </Text>
              <Text> {email}</Text>
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.stats}>
              <Text style={styles.numbers}>
                {readingList} {"\n"}
              </Text>
              <Text>Saved Books</Text>
            </Text>

            <Text style={styles.stats}>
              <Text>
                {followers} {"\n"}
              </Text>
              <Text>Followers</Text>
            </Text>

            <Text style={styles.stats}>
              <Text style={styles.numbers}>
                {following} {"\n"}
              </Text>
              <Text>Following</Text>
            </Text>

            <Text style={styles.stats}>
              <Text>
                {works} {"\n"}
              </Text>
              <Text>Written Books</Text>
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isProfileView && styles.buttonActive]}
              onPress={() => {setIsProfileView(true)}}
            >
              <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !isProfileView && styles.buttonActive]}
              onPress={experience}
            >
              <Text style={styles.buttonText}>Stats</Text>
            </TouchableOpacity>
          </View>
        {isProfileView ? (
        <>
        <Paragraph style={styles.ParagraphStyle}>Your Books</Paragraph>

        <View style={[styles.scrollContainer, { flex: 6 }]}>
          {books &&
            books.map((item) => (
              <TouchableOpacity key={key_id++} onPress={() => viewBook(item)}>
                <BookView
                  key={key_id++}
                  NbViews={item.views}
                  imgData={item.image.data}
                  bookTitle={item.title}
                  bookTag={item.tag}
                  bookAuthor={"you"}
                />
              </TouchableOpacity>
            ))}
        </View>
        </>): (
            <WelcomeView />
          )}
      </ScrollView>
    </DarkBackgroundS>
  );
}

const styles = StyleSheet.create({
  infoText: { color: theme.colors.text, fontSize: 17, alignSelf: "center" },
  stats: { color: theme.colors.text, },

  statsContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },

  container: {
    flex: 2,
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    paddingTop: 15,
  },

  subHeaderStyle: {
    alignSelf: "center",
    color: theme.colors.text,
    fontSize: 18,
  },
  scrollContainer: { flex: 5, borderRadius: 15, padding: 10 },
  info: { paddingBottom: 10, color: theme.colors.text },
  ParagraphStyle: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 5,
    bottom: -20,
    color: "#64CCC5",
    marginLeft: 10
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  buttonActive: {
    backgroundColor: '#64CCC5',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputGroup: {
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: "#64CCC5"
  },
  level: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputGroup: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  text: {
    fontSize: 24, // adjust this value to increase or decrease the text size
    // add other styles if needed
    color:"#64CCC5",
    marginBottom: 10
  },
  progressBar: {
    // height: 10, // adjust this value to increase or decrease the progress bar height
    // borderRadius: 5, // adding some border radius to make it look nice
    // flex: 1, 
  },
});
